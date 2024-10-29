import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  content: string;
  image?: string; 
  date: string; 
  visibility: "public" | "private" | "friends"; 
  tag: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
 
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
    type: Schema.Types.ObjectId, 
    ref: "Tag",
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
  
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;