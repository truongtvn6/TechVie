const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cấu hình SDK Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình bộ nhớ tạm thời bằng Multer (lưu dạng Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper để upload file buffer lên Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "techvie_products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        return reject(new Error("Upload thất bại không rõ nguyên nhân"));
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
