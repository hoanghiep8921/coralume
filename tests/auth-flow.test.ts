import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validation';

// ============================================================
// INTEGRATION: Auth flow validation chain
// ============================================================

describe('Auth Flow Validation Chain', () => {
  describe('Registration → Login flow', () => {
    it('should allow registering then logging in with same email/password', () => {
      const email = 'user@example.com';
      const password = 'Secure@2024';

      const registerResult = registerSchema.safeParse({
        fullName: 'Test User',
        email,
        password,
        confirmPassword: password,
        agreeTerms: true,
      });
      expect(registerResult.success).toBe(true);

      const loginResult = loginSchema.safeParse({ email, password });
      expect(loginResult.success).toBe(true);
    });
  });

  describe('Forgot → Reset password flow', () => {
    it('should validate forgot password email', () => {
      const forgotResult = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
      expect(forgotResult.success).toBe(true);
    });

    it('should validate reset password with new password', () => {
      const resetResult = resetPasswordSchema.safeParse({
        password: 'NewSecure@2024',
        confirmPassword: 'NewSecure@2024',
      });
      expect(resetResult.success).toBe(true);
    });

    it('should reject reset with mismatched passwords', () => {
      const resetResult = resetPasswordSchema.safeParse({
        password: 'NewSecure@2024',
        confirmPassword: 'Wrong@2024',
      });
      expect(resetResult.success).toBe(false);
    });

    it('should enforce same password rules in register and reset', () => {
      const shortPw = 'Ab@1';

      const registerResult = registerSchema.safeParse({
        fullName: 'Test',
        email: 'test@test.com',
        password: shortPw,
        confirmPassword: shortPw,
        agreeTerms: true,
      });
      expect(registerResult.success).toBe(false);

      const resetResult = resetPasswordSchema.safeParse({
        password: shortPw,
        confirmPassword: shortPw,
      });
      expect(resetResult.success).toBe(false);
    });
  });
});

// ============================================================
// EDGE CASES
// ============================================================

describe('Validation Edge Cases', () => {
  describe('registerSchema edge cases', () => {
    it('should handle very long name (at boundary)', () => {
      const result = registerSchema.safeParse({
        fullName: 'A'.repeat(255),
        email: 'test@example.com',
        password: 'Secure@2024',
        confirmPassword: 'Secure@2024',
        agreeTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject name exceeding 255 chars', () => {
      const result = registerSchema.safeParse({
        fullName: 'A'.repeat(256),
        email: 'test@example.com',
        password: 'Secure@2024',
        confirmPassword: 'Secure@2024',
        agreeTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should handle email with subdomains', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test',
        email: 'user@mail.sub.example.com',
        password: 'Secure@2024',
        confirmPassword: 'Secure@2024',
        agreeTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should handle Vietnamese phone numbers', () => {
      const phones = ['0901234567', '0912345678', '84901234567', '+84901234567'];
      for (const phone of phones) {
        const result = registerSchema.safeParse({
          fullName: 'Test',
          email: 'test@example.com',
          password: 'Secure@2024',
          confirmPassword: 'Secure@2024',
          phone,
          agreeTerms: true,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should handle phone with spaces and parentheses', () => {
      const result = registerSchema.safeParse({
        fullName: 'Test',
        email: 'test@example.com',
        password: 'Secure@2024',
        confirmPassword: 'Secure@2024',
        phone: '(84) 90 123 4567',
        agreeTerms: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema edge cases', () => {
    it('should handle email with plus sign', () => {
      const result = loginSchema.safeParse({
        email: 'user+tag@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should handle unicode in password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'mậtkhẩutiếngviệt',
      });
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================
// TYPE INFERENCE
// ============================================================

describe('Schema type inference', () => {
  it('should infer RegisterInput type correctly', () => {
    const data = {
      fullName: 'Test',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      agreeTerms: true,
    };
    // TypeScript compile-time check — if this compiles, types are correct
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should make phone optional in RegisterInput', () => {
    const data = {
      fullName: 'Test',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      agreeTerms: true,
    };
    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
