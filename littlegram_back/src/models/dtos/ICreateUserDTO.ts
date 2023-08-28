export interface ICreateUserDTO {
  realName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isAdmin: boolean;
  confirmed: boolean;
}
