import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { z } from 'zod';
import { Request, Response } from 'express';
import { SendEmailVerificationService } from '../services/users/SendEmailVerificationService';
import { AuthenticateUserService } from '../services/users/AuthenticateUserService';
import { CreateUserService } from '../services/users/CreateUserService';
import { ShowUserService } from '../services/users/ShowUserService';

const createUserSchema = z.object({
  realName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

export class UsersController {
  async create(request: Request, response: Response) {
    const { realName, username, email, password, avatar, bio, isAdmin } =
      createUserSchema.parse(request.body);

    const createUserService = container.resolve(CreateUserService);
    const authenticateUserService = container.resolve(AuthenticateUserService);
    // const sendEmailVerificationService = container.resolve(
    //   SendEmailVerificationService,
    // );

    const user = await createUserService.execute({
      realName,
      username,
      email: email.toUpperCase(),
      password,
      avatar,
      bio,
      isAdmin: isAdmin || false,
      confirmed: true,
    });

    const { token } = await authenticateUserService.execute({
      email: email.toUpperCase(),
      password,
    });

    // sendEmailVerificationService.execute({
    //   token,
    //   user,
    // });

    return response.status(200).json({ user: instanceToInstance(user), token });
  }

  async show(request: Request, response: Response) {
    const { limit, offset } = request.query;

    const showUserService = container.resolve(ShowUserService);

    const users = await showUserService.execute(Number(limit), Number(offset));

    return response.status(200).json(instanceToInstance(users));
  }
}
