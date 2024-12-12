import { IComment } from "./IComment";
import { IGroup } from "./IGroup";
import { ITag } from "./ITag";
import { IUser } from "./IUser";

export interface IPost {
    _id: string;
    content: string;
    username: string;
    avatar: string;
    visibility?: string;
    tag: ITag;
    image?: string;
    doc?: string;
    video?: string;
    likes?: string[];
    date: string;
    comments?: Array<IComment>;
    post?: any;
    user: IUser;
    isVerified?: boolean;
    likeCount: number;
    group: IGroup;
  }
  
  export interface LikeProps {
    message: string;
  }