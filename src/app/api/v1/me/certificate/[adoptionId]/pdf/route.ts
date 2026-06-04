import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateCertificatePDF } from '@/lib/certificate';

// ============================================================
// GET — download certificate as PDF
// ============================================================

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ adoptionId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { adoptionId } = await params;

    const adoption = await prisma.adoption.findUnique({
      where: { id: adoptionId },
      include: {
        user: { select: { id: true, fullName: true } },
        product: { select: { name: true } },
        certificate: { select: { id: true } },
      },
    });

    if (!adoption) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (adoption.user.id !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const pdfBuffer = await generateCertificatePDF({
      adopterName: adoption.user.fullName,
      coralName: adoption.customName || undefined,
      productName: adoption.product.name,
      adoptionDate: adoption.adoptedAt?.toISOString() || adoption.createdAt.toISOString(),
      adoptionId: adoption.id,
    });

    // Create certificate record if not exists
    if (!adoption.certificate) {
      await prisma.certificate.create({
        data: { adoptionId: adoption.id, pdfUrl: '' }, // PDF is generated on-the-fly
      });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="coralume-certificate-${adoptionId.slice(0, 8)}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
