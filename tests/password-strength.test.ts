import { describe, it, expect } from 'vitest';

/**
 * Password strength meter logic (extracted from RegisterPage)
 *
 * Scoring criteria:
 * - Length >= 8 → +1
 * - Contains uppercase → +1
 * - Contains digit → +1
 * - Contains special char → +1
 *
 * Levels: 0=empty, 1=Yếu, 2=Trung bình, 3=Khá, 4=Mạnh
 */

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Yếu', color: 'bg-error' };
  if (score <= 2) return { level: 2, label: 'Trung bình', color: 'bg-amber-500' };
  if (score <= 3) return { level: 3, label: 'Khá', color: 'bg-on-tertiary-container' };
  return { level: 4, label: 'Mạnh', color: 'bg-green-500' };
}

describe('getPasswordStrength', () => {
  it('should return empty level for empty string', () => {
    const result = getPasswordStrength('');
    expect(result.level).toBe(0);
    expect(result.label).toBe('');
  });

  it('should return level 1 (Yếu) for short password', () => {
    const result = getPasswordStrength('abc');
    expect(result.level).toBe(1);
    expect(result.label).toBe('Yếu');
  });

  it('should return level 1 (Yếu) for 8 chars with only lowercase', () => {
    const result = getPasswordStrength('abcdefgh');
    expect(result.level).toBe(1);
    expect(result.label).toBe('Yếu');
  });

  it('should return level 2 (Trung bình) for password with length + one extra', () => {
    // length >= 8 + uppercase = score 2
    const result = getPasswordStrength('Abcdefgh');
    expect(result.level).toBe(2);
    expect(result.label).toBe('Trung bình');
  });

  it('should return level 3 (Khá) for password with length + uppercase + digit', () => {
    const result = getPasswordStrength('Abcdefg1');
    expect(result.level).toBe(3);
    expect(result.label).toBe('Khá');
  });

  it('should return level 4 (Mạnh) for password with all 4 criteria', () => {
    const result = getPasswordStrength('Abcdefg1!');
    expect(result.level).toBe(4);
    expect(result.label).toBe('Mạnh');
    expect(result.color).toBe('bg-green-500');
  });

  it('should count special characters correctly', () => {
    // length >= 8 + digit + special = score 3
    const result = getPasswordStrength('12345678!');
    expect(result.level).toBe(3);
  });

  it('should handle Vietnamese characters as special chars', () => {
    // length >= 8 + uppercase + special(ễ) = score 3
    const result = getPasswordStrength('TiếngViệt1!');
    expect(result.level).toBe(4); // uppercase + digit + special + length
  });

  it('should return correct color for each level', () => {
    expect(getPasswordStrength('abc').color).toBe('bg-error');
    expect(getPasswordStrength('Abcdefgh').color).toBe('bg-amber-500');
    expect(getPasswordStrength('Abcdefg1').color).toBe('bg-on-tertiary-container');
    expect(getPasswordStrength('Abcdefg1!').color).toBe('bg-green-500');
  });

  it('should handle very long passwords', () => {
    const result = getPasswordStrength('A'.repeat(100) + '1!');
    expect(result.level).toBe(4);
  });

  it('should treat only length >= 8 as qualifying', () => {
    // exactly 7 chars — no length point
    const result = getPasswordStrength('Ab1!def');
    // Has uppercase, digit, special = 3 points, but length < 8 so only 3
    // 3 points → level 3 (Khá)
    expect(result.level).toBe(3);
  });

  it('should give 1 point for length criterion at exactly 8 chars', () => {
    // At 8 chars with lowercase only → 1 point → Yếu
    const result = getPasswordStrength('abcdefgh');
    expect(result.level).toBe(1);
  });
});
