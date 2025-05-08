import { Router } from "express";
import { ExtractData } from "./controller";
import { uploadImages } from "./middleware/multer";

const router = Router();

router.post("/api/aadhaar-ocr-data", uploadImages,ExtractData);

export default router;
