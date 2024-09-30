import mongoose, { model, Schema } from "mongoose";

export interface IComment extends Document {
  postID: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  avatar?: string;
  username: string;
  content: string;
  image?: string;
  date: string;
}

// Defined Schema 
const CommentSchema: Schema = new Schema({
  avatar: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
  },
  content: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    default: () => new Date().toISOString() 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postID:{
    type:Schema.Types.ObjectId,  
    ref:'Post',
    required: true
  }
});

// Initialize model for Comment Schema
const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
