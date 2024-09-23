// src/types/express.d.ts
import { IUser } from "../models/userModel";  // Adjust the path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  // Extend to include `user`, optional because it may not always be set
    }
  }
}
