import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getEnvVar from "./getEnvVar";
import { z } from "zod";
import { nanoid } from "nanoid";
import mime from "mime-types";
import contentDisposition from "content-disposition";

const endpoint = getEnvVar("S3_ENDPOINT");
const backblazeRegion = new URL(endpoint).hostname.match(
  /^s3\.([a-z0-9-]+)\.backblazeb2\.com$/,
)?.[1];
const s3 = new S3Client({
  region:
    process.env.S3_REGION ||
    process.env.AWS_REGION ||
    backblazeRegion ||
    "us-east-1",
  endpoint,
  // S3-compatible local endpoints may not resolve bucket subdomains correctly.
  forcePathStyle: true,
  // Keep optional checksums off for S3-compatible providers that predate SDK v3 defaults.
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: getEnvVar("S3_ACCESS_KEY_ID"),
    secretAccessKey: getEnvVar("S3_SECRET_ACCESS_KEY"),
  },
});

export async function s3Upload(
  body: Uint8Array,
  filename: string,
): Promise<{ Location: string; Key: string; Bucket: string }> {
  const mimeType = mime.lookup(filename) || "application/octet-stream";
  const Bucket = getEnvVar("S3_BUCKET_NAME");
  const Key = nanoid();
  const result = await new Upload({
    client: s3,
    params: { Bucket, Key, Body: body, ContentType: mimeType },
  }).done();

  return {
    Bucket,
    Key,
    Location:
      result.Location || `${endpoint.replace(/\/$/, "")}/${Bucket}/${Key}`,
  };
}

type S3GetSignedUrlParams = {
  objectKey: string;
  expirationSecs: number;
  filename: string;
};

export async function s3GetSignedUrl({
  objectKey,
  expirationSecs,
  filename,
}: S3GetSignedUrlParams) {
  const command = new GetObjectCommand({
    Bucket: getEnvVar("S3_BUCKET_NAME"),
    Key: objectKey,
    ResponseContentDisposition: contentDisposition(filename, {
      type: "inline",
    }),
  });

  const url = await getSignedUrl(s3, command, { expiresIn: expirationSecs });

  if (z.string().safeParse(url).success !== true) {
    throw new Error("could not parse signed url");
  }
  return url;
}

export default s3;
