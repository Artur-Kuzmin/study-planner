"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          throw new Error("Failed to load profile");
        }
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setProfilePic(data.profilePic || "");
        setIsGuest(data.id === "guest");
      } catch (err) {
        setError("Could not load profile data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isGuest) {
      setError("Guests cannot upload profile pictures.");
      return;
    }

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setProfilePic(data.profilePic);
      setMessage("Picture uploaded successfully!");
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setError("Guest profile cannot be saved.");
      return;
    }
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profilePic }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      setMessage("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6 bg-transparent">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600 dark:border-zinc-800 dark:border-t-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Your Profile
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Manage your personal information.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 px-4 py-2.5 text-sm font-medium transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            Sign Out
          </button>
        </header>

        <main className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col space-y-7">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative group">
                <div className="flex-none">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-28 w-28 rounded-full object-cover ring-4 ring-zinc-50 dark:ring-zinc-950 shadow-md" />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-500 dark:text-zinc-400 ring-4 ring-zinc-50 dark:ring-zinc-950 shadow-md uppercase">
                      {name.charAt(0) || email.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 rounded-full backdrop-blur-[1px]">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <label 
                    className={`inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{uploading ? "Updating..." : "Upload New Photo"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isGuest || uploading}
                    />
                  </label>
                  {isGuest && (
                    <span className="text-[10px] text-zinc-500">Not available for guests</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Recommended: Square JPG or PNG.
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="flex flex-col space-y-2.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isGuest}
                  className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 text-zinc-900 dark:text-zinc-50 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm outline-none disabled:opacity-60"
                />
              </div>
              
              <div className="flex flex-col space-y-2.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className="block w-full rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 py-3.5 px-4 text-zinc-500 dark:text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 cursor-not-allowed sm:text-sm outline-none"
                />
                <p className="text-[10px] text-zinc-500">{isGuest ? "Guest identity." : "Email cannot be changed."}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              {!isGuest && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
