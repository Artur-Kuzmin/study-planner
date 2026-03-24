import { readFileSync, writeFileSync, existsSync } from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!existsSync(dataFilePath)) {
      writeFileSync(dataFilePath, JSON.stringify({ users: [] }, null, 2));
    }

    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);

    const userExists = data.users.some((u: any) => u.email === email);
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Generate simple ID
    const newId = data.users.length > 0 ? Math.max(...data.users.map((u: any) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      name,
      email,
      password, // Note: storing plain text just for this simple mockup project as requested
      profilePic: "",
    };

    data.users.push(newUser);
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_session',
      value: email,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
