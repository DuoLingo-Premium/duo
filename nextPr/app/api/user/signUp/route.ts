import { NextResponse } from "next/server";
import prisma from "@libdb";
import { hashPassword } from "@lib/passwordUtils";
import { saveImage } from "@lib/imageUtils";
import fs from "fs";
import path from "path";

export async function POST(req: Request, res: Response) {
  if (req.method === "POST") {
    const formData = await req.formData();
    const { username, email, password, role } = {
      username: formData.get("username")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      role: formData.get("role")?.toString() ?? "USER",
    };

    const requiredFields = ["username", "email", "password", "role"];

    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)?.toString()
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { errors: [`Missing fields: ${missingFields.join(", ")}`] },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash: hashedPassword,
        profilePicture: "/user/default-pp.png",
        role: role || "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    const file = formData.get("profilePicture");
    if (file instanceof Blob) {
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { errors: ["Image size exceeds the maximum allowed size (5 MB)"] },
          { status: 400 }
        );
      }
      try {
        const fileExtension = file.type.split("/").pop() || "invalid";
        const buffer = Buffer.from(await file.arrayBuffer());
        const imagePath = saveImage(buffer, user.id.toString(), fileExtension);

        if (imagePath) {
          await prisma.user.update({
            where: { id: user.id },
            data: { profilePicture: imagePath },
          });
        } else {
          await prisma.user.delete({ where: { id: user.id } });
          return NextResponse.json(
            { errors: ["Error saving the image"] },
            { status: 500 }
          );
        }
      } catch (error) {
        await prisma.user.delete({ where: { id: user.id } });
        console.error("Error saving the image:", error);
        return NextResponse.json(
          { errors: ["Error saving the image"] },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ user, ok: true }, { status: 200 });
  }
}
