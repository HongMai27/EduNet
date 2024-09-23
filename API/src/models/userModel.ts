import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone?: string;
  sex?: "male" | "female" | "other"; 
  birthday?: string;
  address?: string;
  avatar: string;
  point?: number;
  posts: mongoose.Schema.Types.ObjectId[]; 
  comparePassword: (password: string) => Promise<boolean>;
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
    required: true
  },
  avatar: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdGr3fTJlsjdAEiSCDznslzUJXqeI22hIB20aDOvQsf9Hz93yoOiLaxnlPEA&s',
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
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
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
