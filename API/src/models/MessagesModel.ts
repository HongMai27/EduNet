import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;  
  content: string;
  date: string;
}

const MessageSchema: Schema = new Schema({
  conversationId: {
    type: mongoose.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,  
  },
  content: {
    type: String,
    required: true,
  },
  date: { 
    type: String, 
    default: () => new Date().toISOString() 
  },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
