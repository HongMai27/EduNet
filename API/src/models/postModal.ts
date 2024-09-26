import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  content: string;
  image?: string; 
  date: string; 
  tag: string;
  visibility: "public" | "private"; 
  user: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    _id: any;
    
    user: mongoose.Schema.Types.ObjectId;
    content: string;
    image?: string; 
    date?: string;  
  }[];
}

const postSchema: Schema<IPost> = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  }, 
  date: { 
    type: String, 
    default: () => new Date().toISOString() 
  }, 
  visibility: { 
    type: String, 
    enum: ["public", "private"], 
    default: "public" 
  }, 
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      content: { type: String, required: true },
      image: { type: String }, 
      date: { type: String }, 
    },
  ],
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
