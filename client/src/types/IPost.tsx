import { IComment } from "./IComment";
import { IUser } from "./IUser";

export interface IPost {
    _id: string;
    content: string;
    username: string;
    avatar: string;
    visibility?: string;
    tag: string;
    image?: string;
    likes?: string[];
    date: string;
    comments?: Array<IComment>;
    post?: any;
    user?: IUser;
    isVerified?: boolean;
  }
  
  export interface LikeProps {
    message: string;
  }