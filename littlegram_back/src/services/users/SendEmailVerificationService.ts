import { inject, injectable } from 'tsyringe';

import { User } from '@models/entities/User';

import { IEmailProvider } from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import { emailConfirmationHTML } from '@shared/container/providers/EmailProvider/templates/EmailConfirmationHTML';

interface Request {
  token: string;

  user: User;
}

@injectable()
export class SendEmailVerificationService {
  constructor(
    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
  ) {}

  public async execute({ token, user }: Request): Promise<void> {
    const emailTemplate = emailConfirmationHTML(user.email, token);

    this.emailProvider.sendEmail({
      to: user.email,
      subject: 'Confirme sua conta',
      html: emailTemplate,
    });
  }
}
