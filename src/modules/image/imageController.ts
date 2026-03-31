import { Request, Response } from "express";
import { uploadFileToR2 } from "../../libraries/r2Service";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided." });
    }

    const file = await uploadFileToR2(req.file);

    return res.status(200).json({
      message: "Image uploaded successfully.",
      file: file.fileName,
      url: file.url,
    });
  } catch (e) {
    console.error("Error uploading image to R2:", e);
    return res.status(500).json({ message: "Error uploading image." });
  }
};

export const transformImage = async (req: Request, res: Response) => {
  try {

  } catch (e) {
  }
};