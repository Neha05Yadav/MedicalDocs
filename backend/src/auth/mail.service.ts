import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendPasswordResetOtp(email: string, otp: string) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass || !from) {
      throw new ServiceUnavailableException(
        'Password reset email service is not configured.',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `MedicalDocs <${from}>`,
      to: email,
      subject: 'Your MedicalDocs password reset code',
      text: `Your MedicalDocs password reset OTP is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;color:#0f172a">
          <h2 style="margin:0 0 12px">Reset your MedicalDocs password</h2>
          <p>Use this one-time code to continue:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px 22px;background:#ecfeff;border-radius:12px;color:#0e7490;text-align:center">${otp}</div>
          <p style="color:#64748b">This code expires in 10 minutes. Never share it with anyone.</p>
          <p style="color:#64748b">If you did not request a password reset, ignore this email.</p>
        </div>`,
    });
  }
}
