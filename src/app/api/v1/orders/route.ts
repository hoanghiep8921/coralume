/**
 * POST /api/v1/orders
 *
 * Create an adoption + payment record and initiate payment.
 * Auth required (JWT cookie). Email must be verified.
 *
 * For VNPay/MoMo: returns redirect URL.
 * For bank_transfer: returns bank info.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createOrderSchema } from '@/lib/validation';
import {
  buildPaymentUrl,
  createPaymentRequest,
  getBankInfo,
  generateReferenceCode,
} from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    // 1. Auth guard
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để thanh toán', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Email verification check
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: { id: true, isVerified: true, fullName: true, email: true, phone: true },
    });

    if (!user || !user.isVerified) {
      return NextResponse.json(
        { error: 'Vui lòng xác thực email trước khi thanh toán', code: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { productId, customName, paymentMethod, agreeTerms } = validation.data;

    // 4. Look up product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Gói sản phẩm không khả dụng', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // 5. Calculate amount (use priceMin)
    const amount = product.priceMin;

    // 6. Create Adoption + Payment in transaction
    const [adoption, payment] = await prisma.$transaction([
      prisma.adoption.create({
        data: {
          userId: user.id,
          productId: product.id,
          customName: customName || null,
          status: 'pending',
        },
      }),
      prisma.payment.create({
        data: {
          userId: user.id,
          amount,
          method: paymentMethod,
          status: 'pending',
        },
      }),
    ]);

    // Link payment to adoption
    await prisma.payment.update({
      where: { id: payment.id },
      data: { adoptionId: adoption.id },
    });

    // 7. Handle payment method
    const orderInfo = `Coralume - ${product.name}${customName ? ` - ${customName}` : ''}`;

    switch (paymentMethod) {
      case 'vnpay': {
        const clientIp =
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

        const redirectUrl = buildPaymentUrl({
          paymentId: payment.id,
          amount,
          orderInfo,
          clientIp,
        });

        // Store gatewayTxnRef
        await prisma.payment.update({
          where: { id: payment.id },
          data: { gatewayTxnId: payment.id.replace(/-/g, '').substring(0, 20) },
        });

        return NextResponse.json({
          data: {
            orderId: adoption.id,
            paymentId: payment.id,
            redirectUrl,
          },
        });
      }

      case 'momo': {
        const momoResponse = await createPaymentRequest({
          requestId: payment.id,
          orderId: adoption.id,
          amount,
          orderInfo,
        });

        if (!momoResponse.success) {
          return NextResponse.json(
            { error: momoResponse.error || 'Không thể tạo thanh toán MoMo', code: 'PAYMENT_ERROR' },
            { status: 502 }
          );
        }

        await prisma.payment.update({
          where: { id: payment.id },
          data: { gatewayTxnId: payment.id },
        });

        return NextResponse.json({
          data: {
            orderId: adoption.id,
            paymentId: payment.id,
            redirectUrl: momoResponse.payUrl,
            qrCodeUrl: momoResponse.qrCodeUrl || null,
          },
        });
      }

      case 'bank_transfer': {
        const bankInfo = getBankInfo();
        const reference = generateReferenceCode(adoption.id);

        return NextResponse.json({
          data: {
            orderId: adoption.id,
            paymentId: payment.id,
            bankInfo: {
              ...bankInfo,
              amount,
              reference,
            },
            redirectUrl: `/thanh-cong?orderId=${adoption.id}`,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: 'Phương thức thanh toán không hợp lệ', code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[POST /api/v1/orders]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
