"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GuestButton } from "@/components/GuestButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to login");
      setIsLoading(false);
      return;
    }

    router.push("/tasks");
    router.refresh();
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6 font-sans">
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-200/20 dark:bg-cyan-900/10 blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Sign in to access your planner.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10 backdrop-blur-sm">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow outline-none"
                placeholder="you@school.edu"
              />
            </div>

            <div className="flex flex-col space-y-2.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm transition-shadow outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
              
              <GuestButton />
            </div>
            
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
