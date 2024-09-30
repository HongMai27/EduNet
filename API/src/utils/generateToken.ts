
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRECT as string, {
    expiresIn: '3h', 
  });
};
