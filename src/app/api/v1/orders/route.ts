/**
 * POST /api/v1/orders
 *
 * Create an adoption + payment record and initiate PayOS payment link.
 * Auth required (JWT cookie). Email must be verified.
 *
 * Returns PayOS checkoutUrl for redirect.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createOrderSchema } from '@/lib/validation';
import { createPaymentLink } from '@/lib/payment';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.payment);
    if (rateLimitResponse) return rateLimitResponse;

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

    // 7. Create PayOS payment link
    const orderCode = Date.now(); // Unique order code (Unix timestamp ms)
    const description = `Coralume - ${product.name}${customName ? ` - ${customName}` : ''}`;

    const payosResult = await createPaymentLink({
      orderCode,
      amount,
      description: description.substring(0, 255),
      buyerName: user.fullName,
      buyerEmail: user.email,
      buyerPhone: user.phone || undefined,
      items: [
        {
          name: product.name,
          quantity: 1,
          price: amount,
        },
      ],
    });

    if (!payosResult.success) {
      return NextResponse.json(
        { error: payosResult.error || 'Không thể tạo link thanh toán', code: 'PAYMENT_ERROR' },
        { status: 502 }
      );
    }

    // Store orderCode in gatewayTxnId for webhook lookup
    await prisma.payment.update({
      where: { id: payment.id },
      data: { gatewayTxnId: String(orderCode) },
    });

    return NextResponse.json({
      data: {
        orderId: adoption.id,
        paymentId: payment.id,
        redirectUrl: payosResult.checkoutUrl,
        qrCode: payosResult.qrCode || null,
      },
    });
  } catch (error) {
    console.error('[POST /api/v1/orders]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
