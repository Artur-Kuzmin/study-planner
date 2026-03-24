import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Set a guest cookie
  cookieStore.set({
    name: 'auth_session',
    value: 'guest_user',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours for guest
  });

  return NextResponse.json({ message: "Continuing as guest" }, { status: 200 });
}
