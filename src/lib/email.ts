import { Resend } from 'resend';

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const FROM_EMAIL = 'Coralume <onboarding@resend.dev>';

export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Xác thực tài khoản Coralume',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">Chào mừng đến với Coralume 🌊</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Cảm ơn bạn đã đăng ký tài khoản. Click nút bên dưới để xác thực email của bạn.
          </p>
          <a href="${verifyUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Xác thực email
          </a>
          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Link có hiệu lực trong 24 giờ.<br/>
            Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.
          </p>
          <hr style="border: none; border-top: 1px solid #c0c8cb; margin: 24px 0;" />
          <p style="color: #70787c; font-size: 12px;">
            Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương<br/>
            Nha Trang, Việt Nam
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send verification email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Đặt lại mật khẩu Coralume',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">Đặt lại mật khẩu</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Bạn đã yêu cầu đặt lại mật khẩu. Click nút bên dưới để tiếp tục.
          </p>
          <a href="${resetUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Đặt lại mật khẩu
          </a>
          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Link có hiệu lực trong 15 phút.<br/>
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send reset email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending reset email:', error);
    return false;
  }
}

export interface CoralUpdateEmailData {
  adopterName: string;
  coralCode: string;
  coralName?: string;
  health: string;
  sizeCm?: number;
  notes?: string;
  dashboardUrl: string;
}

export async function sendCoralUpdateEmail(
  to: string,
  data: CoralUpdateEmailData
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }

    const healthLabel =
      data.health === 'good' ? '🟢 Tốt' :
      data.health === 'average' ? '🟡 Trung bình' :
      '🔴 Cần chú ý';

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🌊 San hô ${data.coralCode} vừa được cập nhật`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">San hô của bạn vừa được cập nhật 🌊</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Chào ${data.adopterName},<br/><br/>
            Nhân viên trung tâm san hô vừa cập nhật tình trạng cho san hô của bạn.
          </p>
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #003441; font-weight: 600; margin: 0 0 8px;">
              📋 ${data.coralCode}${data.coralName ? ` — ${data.coralName}` : ''}
            </p>
            <p style="color: #40484b; margin: 4px 0;">
              <strong>Sức khoẻ:</strong> ${healthLabel}
            </p>
            ${data.sizeCm ? `<p style="color: #40484b; margin: 4px 0;"><strong>Kích thước:</strong> ${data.sizeCm} cm</p>` : ''}
            ${data.notes ? `<p style="color: #40484b; margin: 4px 0;"><strong>Ghi chú:</strong> ${data.notes}</p>` : ''}
          </div>
          <a href="${data.dashboardUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Xem Dashboard →
          </a>
          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Bạn nhận được email này vì bạn là người nhận nuôi san hô này.<br/>
            Bạn có thể tắt thông báo trong phần Cài đặt profile.
          </p>
          <hr style="border: none; border-top: 1px solid #c0c8cb; margin: 24px 0;" />
          <p style="color: #70787c; font-size: 12px;">
            Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương<br/>
            Nha Trang, Việt Nam
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send coral update email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending coral update email:', error);
    return false;
  }
}

/**
 * Generic email sender — used for bulk emails and custom admin messages.
 */
/**
 * Payment confirmation email with invoice details.
 * Sent automatically after PayOS webhook confirms successful payment.
 * SRS §5.3: "Sau khi thanh toán thành công, tự động gửi hoá đơn PDF qua email."
 */
export interface PaymentConfirmationData {
  adopterName: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  orderCode: string;
  paidAt: string;
  coralName?: string;
  dashboardUrl: string;
}

export async function sendPaymentConfirmationEmail(
  to: string,
  data: PaymentConfirmationData
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }

    const methodLabel =
      data.paymentMethod === 'vnpay' ? 'VNPay' :
      data.paymentMethod === 'momo' ? 'MoMo' :
      'Chuyển khoản ngân hàng';

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Xác nhận thanh toán — Coralume #${data.orderCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">Thanh toán thành công!</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Chào ${data.adopterName},<br/><br/>
            Cảm ơn bạn đã đồng hành cùng Coralume. Thanh toán của bạn đã được xác nhận.
          </p>

          <!-- Hoá đơn -->
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h2 style="color: #003441; font-size: 16px; margin: 0 0 12px;">Chi tiết hoá đơn</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #70787c;">Mã đơn hàng</td>
                <td style="padding: 6px 0; color: #003441; font-weight: 600; text-align: right;">#${data.orderCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #70787c;">Gói sản phẩm</td>
                <td style="padding: 6px 0; color: #003441; font-weight: 600; text-align: right;">${data.productName}</td>
              </tr>
              ${data.coralName ? `
              <tr>
                <td style="padding: 6px 0; color: #70787c;">Tên san hô</td>
                <td style="padding: 6px 0; color: #003441; font-weight: 600; text-align: right;">${data.coralName}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #70787c;">Phương thức</td>
                <td style="padding: 6px 0; color: #003441; font-weight: 600; text-align: right;">${methodLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #70787c;">Ngày thanh toán</td>
                <td style="padding: 6px 0; color: #003441; font-weight: 600; text-align: right;">${new Date(data.paidAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 8px 0; color: #003441; font-weight: 700; font-size: 16px;">Tổng thanh toán</td>
                <td style="padding: 8px 0; color: #003441; font-weight: 700; font-size: 16px; text-align: right;">${data.amount.toLocaleString('vi-VN')} VND</td>
              </tr>
            </table>
          </div>

          <a href="${data.dashboardUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Xem Dashboard →
          </a>

          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Hoá đơn này được tạo tự động bởi Coralume.<br/>
            Mọi thắc mắc vui lòng liên hệ hello@coralume.vn.
          </p>
          <hr style="border: none; border-top: 1px solid #c0c8cb; margin: 24px 0;" />
          <p style="color: #70787c; font-size: 12px;">
            Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương<br/>
            Nha Trang, Việt Nam
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send payment confirmation email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending payment confirmation:', error);
    return false;
  }
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      console.error('[Resend] Failed to send email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending email:', error);
    return false;
  }
}

/**
 * Ambassador welcome + congratulations email.
 * Sent automatically when an adopter reaches the referral threshold.
 */
export interface AmbassadorWelcomeData {
  adopterName: string;
  referralCount: number;
  dashboardUrl: string;
}

export async function sendAmbassadorWelcomeEmail(
  to: string,
  data: AmbassadorWelcomeData
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Chúc mừng bạn đã trở thành Đại sứ Coralume!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">Chúc mừng bạn đã trở thành Đại sứ Coralume!</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Chào ${data.adopterName},<br/><br/>
            Bạn vừa đạt mốc <strong>${data.referralCount} lượt giới thiệu</strong> — đủ điều kiện để trở thành <strong>Đại sứ Coralume</strong>.
          </p>
          <div style="background-color: #f8f4e6; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #9f411e;">
            <p style="color: #003441; font-weight: 600; margin: 0 0 8px;">
              Quyền lợi Đại sứ của bạn:
            </p>
            <ul style="color: #40484b; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 4px;">Badge Đại sứ hiển thị trên profile và bảng xếp hạng</li>
              <li style="margin-bottom: 4px;">Voucher trải nghiệm lặn miễn phí tại Nha Trang</li>
              <li style="margin-bottom: 4px;">Quà tặng Coralume phiên bản giới hạn</li>
              <li>Lời mời tham dự sự kiện offline độc quyền</li>
            </ul>
          </div>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Chúng tôi sẽ liên hệ với bạn trong thời gian tới để gửi quà tặng và hướng dẫn nhận voucher.
          </p>
          <a href="${data.dashboardUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Xem Dashboard →
          </a>
          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Cảm ơn bạn đã đồng hành cùng Coralume trong sứ mệnh bảo vệ đại dương.<br/>
            Mỗi san hô được nhận nuôi là một bước tiến cho hệ sinh thái biển.
          </p>
          <hr style="border: none; border-top: 1px solid #c0c8cb; margin: 24px 0;" />
          <p style="color: #70787c; font-size: 12px;">
            Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương<br/>
            Nha Trang, Việt Nam
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send ambassador email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending ambassador email:', error);
    return false;
  }
}

/**
 * Monthly/quarterly report email.
 * SRS §5.3: "Báo cáo hàng tháng/quý (theo gói)"
 *
 * Sent to adopters on Reef Guardian and Diving Experience tiers.
 * Triggered by cron job / scheduled task.
 */
export interface ReportEmailData {
  adopterName: string;
  reportType: 'monthly' | 'quarterly';
  totalCorals: number;
  reefArea: number;
  co2Absorbed: number;
  newUpdates: number;
  topCoralName: string;
  dashboardUrl: string;
}

export async function sendReportEmail(
  to: string,
  data: ReportEmailData
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[Resend] No API key configured');
      return false;
    }

    const typeLabel =
      data.reportType === 'monthly' ? 'hàng tháng' : 'hàng quý';

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Báo cáo ${typeLabel} Coralume — San hô của bạn`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #003441; font-size: 24px;">Báo cáo ${typeLabel} của bạn</h1>
          <p style="color: #40484b; font-size: 16px; line-height: 1.6;">
            Chào ${data.adopterName},<br/><br/>
            Đây là báo cáo ${typeLabel} về san hô của bạn tại Coralume.
          </p>
          <div style="background-color: #f8f4e6; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #003441; font-weight: 600; margin: 0 0 12px;">
              Tổng quan
            </p>
            <table style="width: 100%; color: #40484b; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0;">San hô đang nuôi</td>
                <td style="text-align: right; font-weight: 600; color: #003441;">${data.totalCorals}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Diện tích rạn được bảo vệ</td>
                <td style="text-align: right; font-weight: 600; color: #003441;">${data.reefArea} m²</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">CO₂ hấp thụ ước tính</td>
                <td style="text-align: right; font-weight: 600; color: #003441;">${data.co2Absorbed} kg</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Cập nhật mới</td>
                <td style="text-align: right; font-weight: 600; color: #003441;">${data.newUpdates}</td>
              </tr>
            </table>
          </div>
          ${data.topCoralName ? `
          <p style="color: #40484b; font-size: 14px;">
            San hô nổi bật: <strong style="color: #003441;">${data.topCoralName}</strong>
          </p>
          ` : ''}
          <a href="${data.dashboardUrl}"
             style="display: inline-block; background-color: #9f411e; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 600; margin: 16px 0;">
            Xem Dashboard →
          </a>
          <p style="color: #70787c; font-size: 14px; margin-top: 24px;">
            Bạn nhận được email này vì bạn đang nuôi san hô tại Coralume.<br/>
            Bạn có thể tắt thông báo trong phần Cài đặt profile.
          </p>
          <hr style="border: none; border-top: 1px solid #c0c8cb; margin: 24px 0;" />
          <p style="color: #70787c; font-size: 12px;">
            Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương<br/>
            Nha Trang, Việt Nam
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Failed to send report email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Resend] Error sending report email:', error);
    return false;
  }
}
