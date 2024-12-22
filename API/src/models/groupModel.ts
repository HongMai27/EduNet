import mongoose, { Document, Schema, model } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description?: string;
  avtgr?:string;
  members: mongoose.Schema.Types.ObjectId[];
  admin: mongoose.Schema.Types.ObjectId;
  posts: mongoose.Schema.Types.ObjectId[];
  createdAt: string;
}

const GroupSchema: Schema = new Schema({
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    avtgr: { 
        type: String, 
        default: "" 
      },
    members: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", 
      },
    ],
    admin: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
    },
    createdAt: { 
      type: String, 
      default: () => new Date().toISOString() 
    }
  });
  
  const Group = model<IGroup>("Group", GroupSchema);
  
  export default Group;
  