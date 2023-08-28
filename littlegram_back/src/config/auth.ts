export const authConfig = {
  jwt: {
    secret: process.env.SECRET_KEY || 'default',
    expiresIn: '1d',
  },
};

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'default',
  port: process.env.EMAIL_PORT || 0,
  secure: false,
  user: process.env.EMAIL_HOST_USER || 'default',
  pass: process.env.EMAIL_HOST_PASSWORD || 'default',
};
