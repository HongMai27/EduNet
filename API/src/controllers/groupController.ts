import { Request, Response } from "express";
import User from "../models/userModel";
import Group from "../models/groupModel";
import path from "path";

interface AuthRequest extends Request {
    userId?: string;
  }

  //create gr
  export const createGroup = async (req: AuthRequest, res: Response) => {
    const { name, description, members } = req.body;
    const userId = req.userId;  
  
    const date = new Date();
  
    try {
      if (!name || typeof name !== "string") {
        console.log("Create group: Name is required and must be a valid string.");
        return res.status(400).json({ msg: "Group name is required and must be a valid string." });
      }
  
      if (description && typeof description !== "string") {
        console.log("Create group: Description must be a valid string.");
        return res.status(400).json({ msg: "Description must be a valid string." });
      }
  
      if (members && members.length > 0) {
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
          return res.status(400).json({ msg: "Some members are invalid." });
        }
      }
  
      const groupMembers = members ? members : [userId]; 
  
      // Tạo nhóm 
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

  //get all gr
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

  //get group detail by id
  export const getGroupDetails = async (req: Request, res: Response) => {
    const groupId = req.params.id;  
  
    try {
      const group = await Group.findById(groupId)
        .populate("admin", "username avatar")  
        .populate("members", "username avatar") 
        .populate({
          path: 'posts',
          populate: [
            { 
              path: 'user',
              select: 'avatar username', 
            },
            { 
              path: 'tag', 
              select: 'tagname', 
            },
            {
              path: 'group',
              select: "name avtgr"
            }
          ],
          options: { sort: { date: -1 } }, 
        })
        .exec();
  
      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }
  
      res.json({
        name: group.name,
        description: group.description,
        avtgr: group.avtgr,
        createdAt: group.createdAt,
        admin: group.admin,  
        members: group.members,  
        posts: group.posts,  
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };

  export const updateGroupInfoAndAddMembers = async (req: AuthRequest, res: Response) => {
    const groupId = req.params.id; 
    const { name, description, members } = req.body;
    const userId = req.userId; 
    
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ msg: "Group not found." });
      }
  
      if (group.admin.toString() !== userId) {
        return res.status(403).json({ msg: "You are not authorized to edit this group." });
      }
  
      if (name && typeof name === "string") {
        group.name = name;
      }
      if (description && typeof description === "string") {
        group.description = description;
      }
  
      // Kiểm tra nếu có thành viên muốn thêm vào nhóm
      if (members && members.length > 0) {
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
          return res.status(400).json({ msg: "Some members are invalid." });
        }
  
        group.members = [...new Set([...group.members, ...members])]; 
      }
  
      await group.save();
  
      if (members && members.length > 0) {
        await User.updateMany(
          { _id: { $in: members } }, 
          { $push: { groups: groupId } } 
        );
      }
  
      console.log("Group updated successfully");
      res.status(200).json(group);  
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    }
  };
  
  