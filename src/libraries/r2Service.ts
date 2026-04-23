import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";
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

const streamToBuffer = async (stream: any): Promise<Buffer> => {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

export const getFileFromR2 = async (keyOrId: string): Promise<Buffer> => {
  let key = keyOrId;

  if (!key.includes(".")) {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: key,
      MaxKeys: 1,
    });
    
    const listResult = await s3.send(listCommand);
    if (listResult.Contents && listResult.Contents.length > 0 && listResult.Contents[0].Key) {
      key = listResult.Contents[0].Key;
    } else {
      throw new Error("File not found.");
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      throw new Error("File empty.");
    }

    return streamToBuffer(response.Body);
  } catch (error: any) {
    if (error.name === "NoSuchKey" || error.Code === "NoSuchKey") {
      throw new Error("File not found.");
    }
    throw error;
  }
};

export const listImagesFromR2 = async (page: number, limit: number) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
  });

  const response = await s3.send(command);
  const allImages = response.Contents || [];
  
  // Sort by LastModified descending
  allImages.sort((a, b) => {
    if (!a.LastModified || !b.LastModified) return 0;
    return b.LastModified.getTime() - a.LastModified.getTime();
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImages = allImages.slice(startIndex, endIndex);

  return {
    images: paginatedImages.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `${process.env.R2_PUBLIC_URL}/${item.Key}`
    })),
    total: allImages.length,
    page,
    limit,
    totalPages: Math.ceil(allImages.length / limit)
  };
};