import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  reporter: mongoose.Schema.Types.ObjectId;
  reportedEntity: mongoose.Schema.Types.ObjectId;
  entityType: "Post" | "User";
  reason: string;
  createdAt: Date;
  status: string;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedEntity: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "entityType", 
    },
    entityType: {
      type: String,
      enum: ["Post", "User"],
      required: true,
    },
    status: { 
      type: String, 
      enum: ["pending", "resolved", "rejected"], 
      default: "pending" 
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", ReportSchema);

export default Report;
