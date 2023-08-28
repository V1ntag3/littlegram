import { EmailContent, IEmailProvider } from '../models/IEmailProvider';

export class FakeEmailProvider implements IEmailProvider {
  public emails: EmailContent[] = [];

  async sendEmail({ to, subject, text, html }: EmailContent): Promise<void> {
    const email = {
      from: `"LitteGram" <${process.env.EMAIL_HOST_USER}>`,
      to,
      subject,
      text,
      html,
    };

    this.emails.push(email);
  }
}
