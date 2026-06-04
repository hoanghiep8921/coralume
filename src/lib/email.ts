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
