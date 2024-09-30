import { IPost } from "./IPost";

export interface ITag {
    _id: string;
    tagname: string;
    posts: IPost[];
  }
  
  
  