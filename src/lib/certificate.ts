/**
 * Certificate PDF Generation — Stub
 *
 * TODO: Implement actual PDF generation when a PDF library is selected.
 * Options: @react-pdf/renderer (React-based), puppeteer (HTML-to-PDF),
 * or pdf-lib (low-level PDF manipulation).
 *
 * For now, the success page shows an HTML certificate preview.
 * This function returns null to indicate PDF is not yet available.
 */

export interface CertificateData {
  adopterName: string;
  coralName?: string;
  productName: string;
  adoptionDate: string;
  adoptionId: string;
}

export async function generateCertificatePDF(
  _data: CertificateData
): Promise<Buffer | null> {
  // TODO: Implement PDF generation
  // When ready, use @react-pdf/renderer or puppeteer
  return null;
}
