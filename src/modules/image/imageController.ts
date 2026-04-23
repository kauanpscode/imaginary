import { Request, Response } from "express";
import { getFileFromR2, uploadFileToR2, listImagesFromR2 } from "../../libraries/r2Service";
import sharp from "sharp";

export const getImage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const buffer = await getFileFromR2(id);
    
    // We try to determine the content type from the extension, or default to jpeg
    let format = "jpeg";
    if (id.includes(".")) {
      const ext = id.split(".").pop()?.toLowerCase();
      if (ext === "png" || ext === "webp" || ext === "gif") {
        format = ext;
      } else if (ext === "jpg") {
        format = "jpeg";
      }
    }
    
    return res.status(200).contentType(`image/${format}`).send(buffer);
  } catch (error: any) {
    console.error(error);
    if (error.message === "File not found.") {
      return res.status(404).json({ message: "Image not found." });
    }
    return res.status(500).json({ message: "Unexpected error." });
  }
};

export const listImages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Page and limit must be positive integers." });
    }

    const result = await listImagesFromR2(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error listing images:", error);
    return res.status(500).json({ message: "Unexpected error while listing images." });
  }
};

type Transformations = {
  resize?: {
    width: number;
    height: number;
  };
  crop?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  rotate?: number;
  format?: "jpeg" | "png" | "webp";
  filters?: {
    grayscale?: boolean;
    sepia?: boolean;
  };
};

type TransformImageBody = {
  transformations: Transformations;
};

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

export const transformImage = async (
  req: Request<{ id: string }, any, TransformImageBody>,
  res: Response,
) => {
  try {
    const { transformations } = req.body;

    if (!transformations) {
      return res.status(400).json({ message: "No transformations provided." });
    }

    const id = req.params.id;

    const originalImage = await getFileFromR2(id);

    let transformedImage = sharp(originalImage);

    if (originalImage !== null) {
      if (transformations.crop) {
        transformedImage = transformedImage.extract({
          width: transformations.crop.width,
          height: transformations.crop.height,
          left: transformations.crop.x,
          top: transformations.crop.y,
        });
      }
      
      if (transformations.resize) {
        transformedImage = transformedImage.resize(
          transformations.resize.width,
          transformations.resize.height,
        );
      }

      if (transformations.rotate) {
        transformedImage = transformedImage.rotate(transformations.rotate);
      }

      if (transformations.format) {
        transformedImage = transformedImage.toFormat(transformations.format);
      }

      if (transformations.filters) {
        if (transformations.filters.grayscale) {
          transformedImage = transformedImage.grayscale();
        }
      }
    }

    const buffer = await transformedImage.toBuffer();

    return res
      .status(200)
      .contentType(`image/${transformations.format || "jpeg"}`)
      .send(buffer);
  } catch (error: any) {
    console.error(error);
    if (error.message === "File not found.") {
      return res.status(404).json({ message: "Image not found." });
    }
    return res.status(500).json({ message: "Unexpected error." });
  }
};
