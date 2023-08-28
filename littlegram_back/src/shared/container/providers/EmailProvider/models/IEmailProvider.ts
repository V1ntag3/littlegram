export interface EmailContent {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmailProvider {
  sendEmail(emailContent: EmailContent): Promise<void>;
}
