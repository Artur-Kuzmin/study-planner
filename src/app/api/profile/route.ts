import { readFileSync, writeFileSync, existsSync } from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!existsSync(dataFilePath)) {
    return NextResponse.json({ error: "No users found" }, { status: 404 });
  }

  const fileContents = readFileSync(dataFilePath, "utf-8");
  const data = JSON.parse(fileContents);
  const user = data.users.find((u: any) => u.email === session);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    profilePic: user.profilePic || "" 
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, profilePic } = await request.json();
    
    if (!existsSync(dataFilePath)) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);
    const userIndex = data.users.findIndex((u: any) => u.email === session);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name !== undefined) data.users[userIndex].name = name;
    if (profilePic !== undefined) data.users[userIndex].profilePic = profilePic;

    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
