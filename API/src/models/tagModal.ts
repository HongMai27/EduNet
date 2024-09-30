import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  tagname: string;
  post: mongoose.Schema.Types.ObjectId[];

}

const TagSchema: Schema<ITag> = new Schema({
  tagname:{
    type: String,
    required: true,
  },
  post:[{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }],
});

const Tag = mongoose.model<ITag>("Tag", TagSchema)
export default Tag