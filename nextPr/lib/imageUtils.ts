import fs from "fs";
import path from "path";

export function saveImage(
  imageBuffer: Buffer,
  userId: string,
  fileExtension: string
): string | null {
  try {
    const validExtensions = ["jpg", "png", "gif", "jpeg"];

    if (!validExtensions.includes(fileExtension.toLowerCase())) {
      throw new Error("Invalid file extension");
    }

    const uploadDir = path.join(process.cwd(), "public", "user", userId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let imagePath: string = path.join(
      uploadDir,
      `profile_picture.${fileExtension}`
    );

    fs.writeFileSync(imagePath, imageBuffer);

    return `/user/${userId}/${path.basename(imagePath)}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}
