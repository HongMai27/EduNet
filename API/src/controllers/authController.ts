import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import User from "../models/userModel";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { OAuth2Client } from "google-auth-library";

interface AuthRequest extends Request {
  userId?: any;
}

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
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "3h" });
    res.json({ token });
    console.log('Log in success with token ', {token})
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};

// gg login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // verify token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ msg: "Invalid Google token payload" });
    }

    const email = payload.email;
    const username = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username });
      await user.save();
    }
    // Check JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "Server configuration error: Missing JWT_SECRET" });
    }

    // Create JWT token 
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      accessToken,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ msg: "Invalid Google token" });
  }
};


export const forgotPassword = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return response.status(404).send({ message: "User not found" });
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    await User.updateOne({ _id: existingUser._id }, { password: hashedPassword });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu",
      text: `Mật khẩu mới của bạn là: ${randomPassword}\n\n Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return response.status(500).send({ message: "Error sending email", error: error.message });
      }
      console.log("Email sent:", info.response);
      return response.status(200).send({ message: "New password sent to your email" });
    });

  } catch (error) {
    console.error("Error in forgot password:", error);
    response.status(500).send({ message: "Error in forgot password", error: (error as Error).message });
  }
};


//change pass
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
      const { userId } = req; 
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(400).send({ message: "The old password is incorrect" });
      }
      if (newPassword.length < 8) {
          return res.status(400).send({ message: "The new password must have at least 8 characters" });
      }

      if (newPassword !== confirmPassword) {
          return res.status(400).send({ message: "The new password and confirmation password do not match" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await User.updateOne({ _id: userId }, { password: hashedNewPassword });

      res.status(200).send({ message: "Change password success" });
  } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).send({ message: "Change password: error" });
  }
};
