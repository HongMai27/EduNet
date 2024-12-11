import { IPost } from "./IPost";
import { IUser } from "./IUser";

export interface INotification{
    _id: string;
    message: string;
    timestamp: string;
    type: string;
    userId: IUser;
    username: string;
    avatar: string;
    postId: IPost;
}