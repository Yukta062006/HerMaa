"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { validateLogin, userExists } from "@/lib/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if user exists locally
    if (!userExists(email)) {
      setError("No account found with this email. Please sign up first.");
      setLoading(false);
      return;
    }

    // Validate password locally
    const user = validateLogin(email, password);
    if (!user) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    // Get backend token
    const result = await api.register(user.name, user.email, user.age || 22, user.language || "en");
    if (result) {
      router.push("/dashboard");
    } else {
      // Backend offline — still allow login with local data
      localStorage.setItem("hermaa_user", JSON.stringify({ name: user.name, email: user.email, age: user.age, language: user.language }));
      localStorage.setItem("hermaa_token", "offline_session");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      // Opens real Google account picker popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const name = user.displayName || "User";
      const email = user.email || "user@gmail.com";

      // Register with backend to get JWT
      const apiResult = await api.register(name, email, 22, "en");
      if (apiResult) {
        router.push("/dashboard");
      } else {
        localStorage.setItem("hermaa_user", JSON.stringify({ name, email }));
        localStorage.setItem("hermaa_token", "google_session");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const e = err as Error;
      const msg = e.message || "";
      if (msg.includes("popup-closed") || msg.includes("cancelled")) {
        setError("Sign-in was cancelled.");
      } else {
        setError("Google sign-in failed: " + msg.split("] ").pop());
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#FCE4EC]/30 to-[#F3E5F5]/40 flex items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white shadow-glass flex items-center justify-center hover:shadow-glass-lg transition-shadow">
        <ArrowLeft className="w-5 h-5 text-hermaa-text" />
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass-lg border border-white/40 p-8 sm:p-10">
          <div className="text-center mb-8">
            <Image src="/hermaa_logo.png" alt="HerMaa" width={130} height={130} className="mx-auto mb-4 rounded-3xl" />
            <h1 className="text-2xl font-bold text-hermaa-text">Welcome Back</h1>
            <p className="text-sm text-hermaa-muted mt-1">Sign in to continue your health journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hermaa-light hover:text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-primary/10" /><span className="px-4 text-xs text-hermaa-light">or</span><div className="flex-1 h-px bg-primary/10" />
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-hermaa-muted mt-6">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
