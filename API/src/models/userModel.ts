import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  phone?: string;
  sex?: "male" | "female" | "other"; 
  birthday?: string;
  address?: string;
  avatar: string;
  imgcover:string;
  point: number;
  savedPosts: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  followings: mongoose.Schema.Types.ObjectId[];
  friend: mongoose.Schema.Types.ObjectId[];
  isOnline?: boolean; 
  lastActive?: string; 
  posts: mongoose.Schema.Types.ObjectId[]; 
  comments: mongoose.Schema.Types.ObjectId[];
  notifications: mongoose.Schema.Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
  resetPasswordToken?: string; 
  resetPasswordExpires?: Date; 
  role: 'admin' | 'user'; 
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  avatar: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdGr3fTJlsjdAEiSCDznslzUJXqeI22hIB20aDOvQsf9Hz93yoOiLaxnlPEA&s',
  },
  imgcover: {
    type: String,
    default: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/anh-bia-facebook-dep/anh-bia-facebook-anime-mat-trang.jpg?1705887967948',
  },
  phone: {
    type: String,
  },
  sex: {
    type: String,
    enum: ["male", "female", "other"], 
  },
  birthday: {
    type: String,
  },
  address: {
    type: String,
  },
  point: {
    type: Number,
    default: 50, 
  },
  savedPosts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }],
  followers: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  followings: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  friend: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  isOnline: { 
    type: Boolean, 
    default: true 
  }, 
  lastActive: { 
    type: String, 
    default: new Date().toISOString() 
  },
  posts: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Post" 
  }],
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Comment",
    required: true
  }],
  notifications: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Notification",
    required: true
  }],
  resetPasswordToken: { 
    type: String, 
    default: null 
  },
  resetPasswordExpires: { 
    type: Date, 
    default: null 
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'], default: 'user' },
});

// Hash password 
userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare password 
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
