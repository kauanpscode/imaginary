import express from "express";
import authMiddleware from "../auth/authMiddleware";
import multer from "multer";
import { uploadImage, transformImage, getImage, listImages } from "./imageController";
import { getFileFromR2 } from "../../libraries/r2Service";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("image"), uploadImage);
router.post("/:id/transform", authMiddleware, transformImage);
router.post("/images/:id", authMiddleware, uploadImage);

// New endpoints for retrieving and listing images
router.get("/", authMiddleware, listImages);
router.get("/:id", authMiddleware, getImage);

router.get("/:id/test", async (req, res) => {
  try {
    const buffer = await getFileFromR2(req.params.id);

    res.contentType("image/jpeg").send(buffer);
  } catch {
    res.status(404).send("Not found");
  }
});
export default router;