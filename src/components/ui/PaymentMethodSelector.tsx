'use client';

interface PaymentMethod {
  value: string;
  label: string;
  description: string;
  icon: string; // Material Symbols icon name
}

const methods: PaymentMethod[] = [
  {
    value: 'vnpay',
    label: 'VNPay',
    description: 'Thanh toán qua cổng VNPay — thẻ ATM nội địa, Visa, Mastercard. Bảo mật & nhanh chóng.',
    icon: 'credit_card',
  },
  {
    value: 'momo',
    label: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo — quét mã QR trong app. Tiện lợi & phổ biến.',
    icon: 'smartphone',
  },
  {
    value: 'bank_transfer',
    label: 'Chuyển khoản ngân hàng (VietQR)',
    description: 'Quét mã VietQR qua 40+ ngân hàng. Tự động xác nhận giao dịch.',
    icon: 'account_balance',
  },
];

interface PaymentMethodSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-on-surface">
        Phương thức thanh toán
      </label>

      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => {
          const isSelected = value === method.value;

          return (
            <button
              key={method.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(method.value)}
              className={`flex items-start gap-4 p-4 text-left rounded-xl border transition-all duration-fast ${
                isSelected
                  ? 'border-secondary bg-secondary/5 shadow-card'
                  : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
              }`}
            >
              {/* Icon */}
              <span
                className={`material-symbols-outlined text-2xl flex-shrink-0 mt-0.5 ${
                  isSelected ? 'text-secondary' : 'text-on-surface-variant'
                }`}
                aria-hidden="true"
              >
                {method.icon}
              </span>

              {/* Label + Description */}
              <div className="flex-grow">
                <span
                  className={`block font-body-md font-medium ${
                    isSelected ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {method.label}
                </span>
                <span className="block text-sm text-on-surface-variant mt-0.5">
                  {method.description}
                </span>
              </div>

              {/* Radio indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-fast ${
                  isSelected
                    ? 'border-secondary'
                    : 'border-outline-variant'
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
