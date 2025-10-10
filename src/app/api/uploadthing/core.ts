/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    // .onUploadComplete(async ({ metadata, file }) => {
    //   console.log("file url", file.ufsUrl);

    //   const { configId } = metadata.input;
    //   return { configId };
    // }),
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("file url", file.ufsUrl);

      const { configId } = metadata.input;

      return {
        configId,
        imageUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
