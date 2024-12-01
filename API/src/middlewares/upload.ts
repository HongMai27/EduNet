import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Cloudinary Storage for image, video, and document
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fileType = file.mimetype.split('/')[0]; 
    let folderName = 'uploadsImg'; 
    let resourceType = 'auto';
    let filename = file.originalname; 

    if (fileType === 'video') {
      folderName = 'uploadsVideos'; 
      resourceType = 'video'; 
    } else if (fileType === 'application') {
      folderName = 'uploadsDocs'; 
      resourceType = 'raw'; // type for file (doc, pdf)
    }

    return {
      folder: folderName, 
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'doc', 'docx', 'pdf'], 
      resource_type: resourceType,
      public_id: filename 
    };
  },
});

// middleware upload
const upload = multer({ storage });

//router upload
const router = express.Router();

// Định nghĩa route upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'Upload successful',
      url: req.file.path 
    });
  } else {
    res.status(400).json({
      message: 'Upload failed',
    });
  }
});


export default router;
