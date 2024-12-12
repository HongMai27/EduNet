import { IPost } from "./IPost";
import { IUser } from "./IUser";

export interface IGroup {
    _id: string; 
    name: string;
    description?: string; 
    avtgr?: string; 
    members: IUser[]; 
    admin: IUser; 
    post: IPost[]; 
    createdAt: string; 
  }
  