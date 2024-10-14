import { IUser } from "./IUser";

export interface IMessage {
    _id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    date: string;
  }