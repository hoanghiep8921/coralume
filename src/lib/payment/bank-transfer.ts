/**
 * Bank Transfer Payment Method
 *
 * Manual verification flow — user transfers money to Coralume bank account,
 * includes reference code in memo. Admin verifies via admin panel.
 *
 * Env vars:
 *   BANK_NAME           — Bank name (e.g. Vietcombank)
 *   BANK_ACCOUNT_NUMBER — Account number
 *   BANK_ACCOUNT_NAME   — Account holder name
 */

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export function getBankInfo(): BankInfo {
  return {
    bankName: process.env.BANK_NAME || 'Vietcombank',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
    accountName: process.env.BANK_ACCOUNT_NAME || 'Coralume Company',
  };
}

/**
 * Generate a reference code for bank transfer memo.
 * Format: CRL-ADOPT-{shortId}
 */
export function generateReferenceCode(adoptionId: string): string {
  const shortId = adoptionId.replace(/-/g, '').substring(0, 8).toUpperCase();
  return `CRL-ADOPT-${shortId}`;
}
