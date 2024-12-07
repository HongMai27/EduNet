import { Request, Response } from "express";
import Post from "../models/postModel";
import User from "../models/userModel";
import Report from "../models/reportModel";


interface AuthRequest extends Request {
    userId?: string;
  }

  //create report
  export const createReport = async (req: AuthRequest, res: Response) => {
    const { reportedEntityId, entityType, reason } = req.body;
  
    console.log("Request body:", req.body);
  
    if (!reportedEntityId || !entityType || !reason) {
      return res.status(400).json({ msg: "Reported entity ID, type, and reason are required." });
    }
  
    if (!["Post", "User"].includes(entityType)) {
      return res.status(400).json({ msg: "Entity type must be 'Post' or 'User'." });
    }
  
    try {
      let reportedEntity;
      if (entityType === "Post") {
        reportedEntity = await Post.findById(reportedEntityId);
      } else if (entityType === "User") {
        reportedEntity = await User.findById(reportedEntityId);
      }
  
      if (!reportedEntity) {
        return res.status(400).json({ msg: `No ${entityType} found with that ID.` });
      }
  
      const report = new Report({
        reporter: req.userId, 
        reportedEntity: reportedEntityId,
        entityType,
        reason,
        createdAt: new Date(),
      });
  
      // Lưu báo cáo vào cơ sở dữ liệu
      await report.save();
  
      res.status(201).json(report);
  
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating report:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    }
  };
  
  export const getAllReports = async (req: Request, res: Response) => {
    try {
      const reports = await Report.find()
        .populate("reporter", "username email");
  
      const enrichedReports = await Promise.all(
        reports.map(async (report) => {
          let reportedEntityDetails: any = null;
  
          if (report.entityType === "Post") {
            const post = await Post.findById(report.reportedEntity).select("content");
            if (post) {
              reportedEntityDetails = { _id: post.id, content: post.content };
            }
          } else if (report.entityType === "User") {
            const user = await User.findById(report.reportedEntity).select("username");
            if (user) {
              reportedEntityDetails = { _id:user.id, username: user.username };
            }
          }
  
          return {
            _id: report._id,
            reporter: report.reporter,
            reportedEntity: reportedEntityDetails,
            entityType: report.entityType,
            reason: report.reason,
            createdAt: report.createdAt,
          };
        })
      );
  
  
      res.status(200).json(enrichedReports);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching reports:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    }
  };
  
  export const getReportById = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
  
      const report = await Report.findById(reportId)
        .populate('reporter', 'username email') 
        .exec();
  
      if (!report) {
        return res.status(404).json({ msg: 'Report not found' });
      }
  
      let reportedEntityDetails: any = null;
  
      if (report.entityType === 'Post') {
        const post = await Post.findById(report.reportedEntity).select('content');
        if (post) {
          reportedEntityDetails = { _id: post._id, content: post.content };
        }
      } else if (report.entityType === 'User') {
        const user = await User.findById(report.reportedEntity).select('username');
        if (user) {
          reportedEntityDetails = { _id: user._id, username: user.username };
        }
      }
  
      res.status(200).json({
        _id: report._id,
        reporter: report.reporter,
        reportedEntity: reportedEntityDetails,
        entityType: report.entityType,
        reason: report.reason,
        createdAt: report.createdAt,
      });
  
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching report details:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
      } else {
        console.error('Unknown error:', err);
        res.status(500).json({ msg: 'Server error' });
      }
    }
  };

  // get report
export const getReports = async (req: Request, res: Response) => {
  try {
    const { reportedEntityId, entityType } = req.query as { reportedEntityId?: string; entityType?: string };

    console.log("Query parameters received:", { reportedEntityId, entityType });

    // Validate các query params
    if (reportedEntityId && !entityType) {
      return res.status(400).json({ msg: "Entity type is required when reported entity ID is provided." });
    }

    if (entityType && !["Post", "User"].includes(entityType)) {
      return res.status(400).json({ msg: "Entity type must be 'Post' or 'User'." });
    }

    // Tạo filter để tìm các báo cáo phù hợp
    let filter: any = {}; 
    if (reportedEntityId) {
      filter.reportedEntity = reportedEntityId;
    }
    if (entityType) {
      filter.entityType = entityType;
    }

    console.log("Filter created:", filter);

    const reports = await Report.find(filter)
      .populate('reporter', 'username email')
      .populate({
        path: 'reportedEntity',
        select: 'title content',
        match: entityType ? { entityType } : {},
      });

    console.log("Reports found:", reports);

    if (reports.length === 0) {
      return res.status(404).json({ msg: "No reports found matching the criteria." });
    }

    res.status(200).json(reports);
  } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating report:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(500).json({ msg: "Server error" });
      }
    }
};
