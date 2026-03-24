"use client";

import { useRouter } from "next/navigation";

interface GuestButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function GuestButton({ className, children }: GuestButtonProps) {
  const router = useRouter();

  const handleGuestEntry = async () => {
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (res.ok) {
        // Force a hard refresh or handle state update
        window.location.href = "/tasks";
      }
    } catch (err) {
      console.error("Guest login failed:", err);
    }
  };

  return (
    <button
      onClick={handleGuestEntry}
      className={className || "text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"}
    >
      {children || "Continue as Guest"}
    </button>
  );
}
