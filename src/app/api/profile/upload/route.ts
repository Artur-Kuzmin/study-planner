import { writeFileSync, readFileSync } from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;

  if (!session || session === "guest_user") {
    return NextResponse.json({ error: "Unauthorized or Guest" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

    writeFileSync(uploadPath, buffer);

    const profilePicUrl = `/uploads/${filename}`;

    // Update users.json
    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);
    const userIndex = data.users.findIndex((u: any) => u.email === session);

    if (userIndex !== -1) {
      data.users[userIndex].profilePic = profilePicUrl;
      writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ profilePic: profilePicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
