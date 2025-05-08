import multer from "multer";
import path from "path";
import { CustomError } from "../middleware/errorHandler";

// Allowed image MIME types
const allowedTypes = /jpeg|jpg|png|webp/;

// File filter to validate MIME type and extension
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(
      new CustomError(
        "Only image files (jpeg, jpg, png, webp) are allowed",
        400
      )
    );
  }
};

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// Configure Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Export middleware to handle both front and back image uploads
export const uploadImages = upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]);
