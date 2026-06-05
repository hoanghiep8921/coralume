'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Two-Factor Authentication (2FA) management section.
 * Embedded in Dashboard or Profile settings.
 * SRS §5: "2FA (Tuỳ chọn) cho admin và nhân viên trung tâm"
 */
export function TwoFactorSection() {
  const [status, setStatus] = useState<'loading' | 'disabled' | 'enabled'>('loading');
  const [step, setStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [secret, setSecret] = useState('');
  const [otpauthUri, setOtpauthUri] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check current 2FA status
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/auth/2fa?action=status');
      const json = await res.json();
      setStatus(json.data?.totpEnabled ? 'enabled' : 'disabled');
    } catch {
      setStatus('disabled');
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Step 1: Generate TOTP secret
  const handleSetup = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/2fa?action=setup', { method: 'POST', body: '{}' });
      const json = await res.json();
      if (res.ok) {
        setSecret(json.data.secret);
        setOtpauthUri(json.data.otpauthUri);
        setStep('verify');
        setSuccess(json.data.message);
      } else {
        setError(json.error);
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify TOTP token and enable 2FA
  const handleEnable = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/2fa?action=enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, token }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('enabled');
        setStep('idle');
        setSecret('');
        setOtpauthUri('');
        setToken('');
        setSuccess('Đã bật xác thực 2 lớp thành công!');
      } else {
        setError(json.error);
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Disable 2FA
  const handleDisable = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/2fa?action=disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('disabled');
        setToken('');
        setSuccess('Đã tắt xác thực 2 lớp.');
      } else {
        setError(json.error);
      }
    } catch {
      setError('Không thể kết nối.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
        <p className="text-on-surface-variant text-sm">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary">
            Xác thực 2 lớp (2FA)
          </h3>
          <p className="text-on-surface-variant font-body-md text-sm mt-1">
            Bảo vệ tài khoản bằng ứng dụng Authenticator (Google Authenticator, Authy, 1Password...)
          </p>
        </div>
        {status === 'enabled' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-sm text-sm">
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              shield_lock
            </span>
            Đã bật
          </span>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 mb-4 bg-error-container/20 border border-error/30 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 mb-4 bg-primary-container/10 border border-secondary/30 rounded-lg">
          <p className="text-primary text-sm">{success}</p>
        </div>
      )}

      {/* DISABLED state — show enable button */}
      {status === 'disabled' && step === 'idle' && (
        <button
          onClick={handleSetup}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            shield_lock
          </span>
          {submitting ? 'Đang xử lý...' : 'Bật xác thực 2 lớp'}
        </button>
      )}

      {/* SETUP step — show QR setup instructions */}
      {status === 'disabled' && step === 'verify' && (
        <div className="space-y-4">
          <div className="bg-surface-container rounded-lg p-4">
            <p className="font-body-md text-on-surface mb-3">
              1. Mở ứng dụng Authenticator trên điện thoại
            </p>
            <p className="font-body-md text-on-surface mb-3">
              2. Quét mã QR hoặc nhập thủ công mã bên dưới:
            </p>
            <div className="bg-white p-4 rounded-lg inline-block mb-3">
              <pre className="font-mono text-sm text-primary break-all select-all">{secret}</pre>
            </div>
            <p className="text-on-surface-variant text-sm">
              URI: {otpauthUri}
            </p>
          </div>

          <div>
            <label htmlFor="totp-verify" className="block font-label-sm text-on-surface mb-1.5">
              3. Nhập mã 6 số từ ứng dụng
            </label>
            <div className="flex gap-3 max-w-sm">
              <input
                id="totp-verify"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-mono text-lg text-center tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <button
                onClick={handleEnable}
                disabled={submitting || token.length !== 6}
                className="px-6 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors disabled:opacity-50"
              >
                {submitting ? '...' : 'Xác nhận'}
              </button>
            </div>
          </div>

          <button
            onClick={() => { setStep('idle'); setError(''); setSuccess(''); }}
            className="text-on-surface-variant text-sm underline hover:text-on-surface"
          >
            Huỷ
          </button>
        </div>
      )}

      {/* ENABLED state — show disable option */}
      {status === 'enabled' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 max-w-sm">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Nhập mã 6 số để tắt"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="flex-1 px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-mono text-lg text-center tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            <button
              onClick={handleDisable}
              disabled={submitting || token.length !== 6}
              className="px-4 py-2.5 border border-error text-error rounded-lg font-label-sm hover:bg-error hover:text-on-secondary transition-colors disabled:opacity-50"
            >
              {submitting ? '...' : 'Tắt 2FA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
