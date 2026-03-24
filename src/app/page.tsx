import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-50 font-sans p-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-200/50 dark:bg-cyan-900/20 blur-3xl pointer-events-none" />
      
      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center text-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 ring-1 ring-indigo-600/20 dark:ring-indigo-400/20 mb-2 transition-transform hover:scale-105 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 drop-shadow-sm">
            Study Planner
          </h1>
          
          <p className="max-w-xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Your personalized student dashboard. Organize assignments, track deadlines, and stay on top of your academic goals effortlessly.
          </p>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {session ? (
            <Link
              href="/tasks"
              className="group relative flex h-14 items-center justify-center gap-3 rounded-full bg-slate-900 px-8 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100 sm:text-lg"
            >
              <span>View My Tasks</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="group relative flex h-14 items-center justify-center gap-3 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:text-lg"
              >
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="group relative flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-slate-900 shadow-md ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 dark:text-white dark:ring-slate-800 dark:hover:bg-slate-800 sm:text-lg"
              >
                <span>Create Account</span>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
