import { emailConfig } from '@config/auth';
import nodemailer from 'nodemailer';
import { EmailContent, IEmailProvider } from '../models/IEmailProvider';

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: Number(emailConfig.port),
  secure: false,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

export class EmailProvider implements IEmailProvider {
  async sendEmail({ to, subject, text, html }: EmailContent): Promise<void> {
    await transporter.sendMail({
      from: `"LitteGram" <${process.env.EMAIL_HOST_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }
}
