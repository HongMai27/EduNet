import { IUser } from "./IUser";
import { IPost } from "./IPost";

export interface IComment {
    _id: string; 
    content: string; 
    date: string; 
    user: IUser; 
    post: IPost; 
    likes?: Array<string>; 
}
