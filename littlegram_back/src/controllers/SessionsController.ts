import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';
import { z } from 'zod';
import { Request, Response } from 'express';
import { ConfirmEmailService } from '../services/users/ConfirmEmailService';
import { AuthenticateUserService } from '../services/users/AuthenticateUserService';

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
// alteracoes feitas
const emailConfirmationSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = authenticateSchema.parse(request.body);

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      email: email.toUpperCase(),
      password,
    });

    return response.json({ user: instanceToInstance(user), token });
  }

  public async patch(request: Request, response: Response): Promise<Response> {
    const { email, token } = emailConfirmationSchema.parse(request.body);

    const confirmEmailService = container.resolve(ConfirmEmailService);

    await confirmEmailService.execute({ email: email.toUpperCase(), token });

    return response.status(200).json();
  }
}
