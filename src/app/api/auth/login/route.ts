import { readFileSync, existsSync } from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!existsSync(dataFilePath)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);

    const user = data.users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_session',
      value: user.email,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json(
      { message: "Logged in successfully", user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
