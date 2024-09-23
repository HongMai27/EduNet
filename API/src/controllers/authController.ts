import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import bcrypt from "bcrypt";

//register
export const register = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log('Received data:', { username, email, password, confirmPassword  });
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already exists');
      return res.status(400).json({ msg: "Email already exists" });
    }

    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Username already exists');
      return res.status(400).json({ msg: "Username already exists" });
      
    }
    if (password !== confirmPassword) {
      console.log("Passwords do not match")
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    user = new User({ username, email, password });
    await user.save();
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.status(201).json({ token });
    console.log('Created new user')
  } catch (err) {
    console.error(err); 
    res.status(500).json({ msg: "Server error" });
  }
};

//login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Received data:', { email, password });

  if (!email || !password) {
    console.log('Enter all fields')
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email')
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password')
      return res.status(400).json({ msg: "Invalid password" });
    }

    // create payload & token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.json({ token });
    console.log('Log in success with token ', {token})
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};

