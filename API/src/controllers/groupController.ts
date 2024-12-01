import { Request, Response } from "express";
import User from "../models/userModel";
import Group from "../models/groupModel";

interface AuthRequest extends Request {
    userId?: string;
  }

  //create gr
  export const createGroup = async (req: AuthRequest, res: Response) => {
    const { name, description, members } = req.body;
    const userId = req.userId;  
  
    const date = new Date();
  
    try {
      // Kiểm tra tên nhóm
      if (!name || typeof name !== "string") {
        console.log("Create group: Name is required and must be a valid string.");
        return res.status(400).json({ msg: "Group name is required and must be a valid string." });
      }
  
      if (description && typeof description !== "string") {
        console.log("Create group: Description must be a valid string.");
        return res.status(400).json({ msg: "Description must be a valid string." });
      }
  
      // Kiểm tra thành viên có hợp lệ không
      if (members && members.length > 0) {
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
          return res.status(400).json({ msg: "Some members are invalid." });
        }
      }
  
      const groupMembers = members ? members : [userId]; 
  
      // Tạo nhóm mới
      const group = new Group({
        name,
        description: description || "", 
        avtgr: '',
        members: groupMembers,
        admin: userId,  
        post: [],        
        createdAt: date.toISOString(),
      });
  
      await group.save();
  
      await User.findByIdAndUpdate(userId, { $push: { groups: group._id } }, { new: true });
  
      // Trả về nhóm vừa tạo
      console.log("Group created successfully");
      res.status(201).json(group);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating group:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    }
  };

  //get gr
  export const getGroups = async (req: Request, res: Response) => {
    try {
      const groups = await Group.find()
        .populate("members", "username avatar")
        .populate("admin", "username avatar");
  
      if (!groups || groups.length === 0) {
        return res.status(404).json({ msg: "No groups found" });
      }
  
      res.status(200).json(groups);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching groups:", error.message, error.stack); 
        res.status(500).json({ msg: "Server error", error: error.message });
      } else {
        console.error("Unknown error:", error); 
        res.status(500).json({ msg: "Server error" });
      }
    }
  };