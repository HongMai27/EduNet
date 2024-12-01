import { IPost } from "./IPost";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    imgcover: string;
    password: string;
    phone?: string;
    sex?: "male" | "female" | "other"; 
    birthday?: string;
    address?: string;
    point?: number;
    accessToken: string;
    followers: Array<string>;
    following: Array<string>;
    friends: Array<string>;
    posts: Array<IPost>;
    isOnline: boolean;
    lastActive: string;
    postCount?: number
    role: "admin" | "user";

  }
  export interface LoginProps {
    email: string;
    password: string;
  }
  
  export interface AuthProps {
    username?: string;
    password: string;
    email: string;
  }

  export interface AuthContextProps {
    username?: string;
    password: string;
    email: string;
    _id: string;
  }
  