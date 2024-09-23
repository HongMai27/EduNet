// import jwt, { Secret } from 'jsonwebtoken';

// export const generateAccessToken = (id: string) => {
//   return jwt.sign({ id }, process.env.ACCESS_TOKEN as Secret, {
//     expiresIn: '15m',
//   });
// };

// export const generateRefreshToken = (id: string) => {
//   return jwt.sign({ id }, process.env.REFRESH_TOKEN as Secret, {
//     expiresIn: '7d',
//   });
// };
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRECT as string, {
    expiresIn: '1h', 
  });
};
