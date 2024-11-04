import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

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

// forget password
// export const forgetPassword = async (req: Request, res: Response) => {
//   const { email } = req.body;

//   console.log('Received email for password reset:', email);

//   if (!email) {
//     return res.status(400).json({ msg: "Please provide an email address" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "No user found with this email" });
//     }

//     const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
//       expiresIn: '1h',
//     });

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; 
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail', 
//       auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASSWORD, 
//       },
//     });

//     const resetUrl = `http://yourfrontend.com/resetpassword/${resetToken}`;
//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: 'Password Reset',
//       text: `You are receiving this because you (or someone else) requested to reset your password.\n\n
//       Please click the following link to reset your password:\n\n
//       ${resetUrl}\n\n
//       If you did not request this, please ignore this email.\n`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
    
//     console.log(`Password reset email sent to ${user.email}`);
    
//     return res.status(200).json({ msg: 'Password reset link sent to your email' });

//   } catch (err) {
//     console.error('Server error:', err);
//     return res.status(500).json({ msg: 'Server error' });
//   }
// };



