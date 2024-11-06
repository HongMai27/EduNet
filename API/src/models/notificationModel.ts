import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  message: string; 
  postId: mongoose.Schema.Types.ObjectId;
  type: "like" | "comment" | "share"; 
  timestamp: Date; 
}

const notificationSchema: Schema<INotification> = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  postId: { 
    type: Schema.Types.ObjectId, 
    ref: "Post", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["like", "comment", "share"], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
