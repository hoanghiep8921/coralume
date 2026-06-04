/**
 * Certificate PDF Generation — jsPDF implementation
 *
 * Generates a beautiful A4 certificate for coral adoptions.
 */
import { jsPDF } from 'jspdf';

export interface CertificateData {
  adopterName: string;
  coralName?: string;
  productName: string;
  adoptionDate: string;
  adoptionId: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = 297; // A4 landscape width
  const h = 210; // A4 landscape height

  // Decorative border
  doc.setDrawColor(15, 76, 92); // Navy Deep
  doc.setLineWidth(2);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setLineWidth(0.5);
  doc.rect(13, 13, w - 26, h - 26);

  // Coralume logo area
  doc.setFillColor(15, 76, 92); // Navy Deep
  doc.rect(20, 20, w - 40, 30, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('CORALUME', w / 2, 39, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate of Coral Adoption', w / 2, 48, { align: 'center' });

  // Certificate body
  doc.setTextColor(44, 62, 80); // Text Dark
  doc.setFontSize(14);
  doc.text('This certifies that', w / 2, 75, { align: 'center' });

  // Adopter name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 76, 92); // Navy
  doc.text(data.adopterName, w / 2, 87, { align: 'center' });

  // Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(44, 62, 80);
  const lines = [
    `has adopted a coral fragment named "${data.coralName || 'Unnamed'}"`,
    `through the ${data.productName} package`,
    `on ${new Date(data.adoptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
  ];
  lines.forEach((line, i) => {
    doc.text(line, w / 2, 100 + i * 9, { align: 'center' });
  });

  // Certificate ID
  doc.setFontSize(10);
  doc.setTextColor(138, 155, 168); // Text Gray
  doc.text(`Certificate ID: ${data.adoptionId}`, w / 2, 135, { align: 'center' });

  // Bottom decorative bar
  doc.setFillColor(232, 119, 80); // Coral Orange
  doc.rect(20, h - 50, w - 40, 3, 'F');

  // Footer text
  doc.setFontSize(9);
  doc.setTextColor(138, 155, 168);
  doc.text('Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương', w / 2, h - 38, { align: 'center' });
  doc.text('www.coralume.vn | hello@coralume.vn', w / 2, h - 33, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('vi-VN')}`, w / 2, h - 28, { align: 'center' });

  // Coral illustration placeholder — simple wave design
  doc.setDrawColor(91, 168, 181); // Teal Mid
  doc.setLineWidth(1);
  for (let x = 40; x < w - 40; x += 15) {
    const y = h - 62 + Math.sin(x * 0.1) * 5;
    doc.circle(x, y, 1.5, 'F');
  }

  return Buffer.from(doc.output('arraybuffer'));
}
