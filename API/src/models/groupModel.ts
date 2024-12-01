import mongoose, { Document, Schema, model } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description?: string;
  avtgr?:string;
  members: mongoose.Schema.Types.ObjectId[];
  admin: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId[];
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
    post: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Post" 
      }],
    admin: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    createdAt: { 
      type: String, 
      default: () => new Date().toISOString() 
    }
  });
  
  const Group = model<IGroup>("Group", GroupSchema);
  
  export default Group;
  