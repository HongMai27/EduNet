import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  ownerId: mongoose.Schema.Types.ObjectId; 
  userId: mongoose.Schema.Types.ObjectId; 
  username: string;
  avatar: string;
  message: string; 
  postId: mongoose.Schema.Types.ObjectId;
  type: "like" | "comment" | "share" | "save" | "follow"; 
  isRead: boolean;
  timestamp: Date; 
}

const notificationSchema: Schema<INotification> = new Schema({
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  avatar: { 
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
    enum: ["like", "comment", "share", "save", "follow"], 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },

  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
