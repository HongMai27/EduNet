import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Set up multer storage with a function to generate short filenames
const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // Define the destination directory for uploaded files
        cb(null, 'public/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        // Generate a short, unique filename for the uploaded file
        const extension = path.extname(file.originalname);
        // Use a shorter unique identifier (e.g., hex representation of a random number)
        const shortName = `img_${crypto.randomBytes(4).toString('hex')}${extension}`;
        cb(null, shortName);
    }
});

// Configure multer with limits and storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});

export { upload };
