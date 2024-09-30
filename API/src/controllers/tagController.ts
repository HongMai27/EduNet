import { Request, Response } from "express";
import Tag from "../models/tagModal";

export const getTags = async (req: Request, res: Response) => {
    try {
      const tag = await Tag.find(); 
      console.log("Tags found:", tag);
      if (!tag.length) {
        return res.status(404).json({ msg: "No tags found." });
      }
      res.status(200).json(tag); 
    } catch (err) {
      console.error("Error fetching tags:", err); 
      if (err instanceof Error) {
        console.error(err.stack); 
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        res.status(500).json({ msg: "Server error", error: "Unknown error" });
      }
    }
  };


export const addTag = async (req: Request, res: Response) => {
    const { tagname } = req.body;
    try {
      let tag = await Tag.findOne({ tagname });
      
      if (tag) {
        return res.status(400).json({ message: "Tag đã tồn tại" });
      }
      tag = new Tag({ tagname });
      await tag.save();
  
      return res.status(201).json({ message: "Tag đã được thêm thành công", tag });
    } catch (error) {
        console.error('add tag error', error)
      return res.status(500).json({ message: "add tag error" });
    }
  };