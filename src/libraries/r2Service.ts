import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "../libraries/r2Client";
import crypto from "crypto";

type UploadResult = {
  fileName: string;
  url: string;
};

export const uploadFileToR2 = async (
  file: Express.Multer.File,
): Promise<UploadResult> => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  const input = {
    Bucket: BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(input);

  await s3.send(command);

  return {
    fileName: fileName,
    url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
  };
};
