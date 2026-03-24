import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { readFileSync } from "fs";
import path from "path";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Your personalized student dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;
  
  let user = null;
  if (session) {
    if (session === "guest_user") {
      user = { name: "Guest User", profilePic: "" };
    } else {
      try {
        const dataFilePath = path.join(process.cwd(), "data", "users.json");
        const fileContents = readFileSync(dataFilePath, "utf-8");
        const data = JSON.parse(fileContents);
        user = data.users.find((u: any) => u.email === session);
      } catch (e) {
        console.error("Layout auth error:", e);
      }
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <nav className="sticky top-0 z-50 flex h-16 items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Study Planner</span>
              </Link>
              
              <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                <Link href="/" className="hidden sm:block text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  Home
                </Link>
                {session ? (
                  <>
                    <Link href="/tasks" className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                      Tasks
                    </Link>
                    <Link
                      href="/tasks/new" 
                      className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                    >
                      + New Task
                    </Link>
                    <Link href="/profile" className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-zinc-200 dark:ring-zinc-800 transition hover:ring-indigo-500">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                      Sign In
                    </Link>
                    <Link
                      href="/register" 
                      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      Create Account
                    </Link>
                  </>
                )}
                <div className="ml-1 flex items-center border-l border-zinc-200 pl-4 dark:border-zinc-800">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1 flex flex-col">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
