import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Buffer memory storage)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Helper to upload image buffer to Cloudinary
export async function uploadToCloudinary(fileBuffer: Buffer, folder: string = "techvie_products"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        return reject(new Error("Upload to Cloudinary failed"));
      }
    );
    uploadStream.end(fileBuffer);
  });
}
