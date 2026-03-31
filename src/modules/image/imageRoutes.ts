import express from "express";
import authMiddleware from "../auth/authMiddleware";
import multer from "multer";
import { uploadImage, transformImage } from "./imageController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("image"), uploadImage);
router.post("/images/:id/transform", authMiddleware, transformImage);
router.post("/images/:id", authMiddleware, uploadImage);

export default router;