"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Heart, Sparkles } from "lucide-react";
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
    if (!userExists(email)) { setError("No account found. Please sign up first."); setLoading(false); return; }
    const user = validateLogin(email, password);
    if (!user) { setError("Incorrect password. Please try again."); setLoading(false); return; }
    const result = await api.register(user.name, user.email, user.age || 22, user.language || "en");
    if (result) { router.push("/dashboard"); }
    else { localStorage.setItem("hermaa_user", JSON.stringify({ name: user.name, email: user.email })); localStorage.setItem("hermaa_token", "offline"); router.push("/dashboard"); }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const name = result.user.displayName || "User";
      const gEmail = result.user.email || "user@gmail.com";
      const apiResult = await api.register(name, gEmail, 22, "en");
      if (apiResult) router.push("/dashboard");
      else { localStorage.setItem("hermaa_user", JSON.stringify({ name, email: gEmail })); localStorage.setItem("hermaa_token", "google"); router.push("/dashboard"); }
    } catch (err: unknown) {
      const e = err as Error;
      if (e.message?.includes("popup-closed")) setError("Sign-in cancelled.");
      else setError("Google sign-in failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-accent relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute top-10 right-10 w-64 h-64 border border-white/10 rounded-full" />
        </div>
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Image src="/hermaa_logo.png" alt="HerMaa" width={160} height={160} className="mx-auto mb-8 rounded-3xl shadow-2xl" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Welcome to HerMaa</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">Your AI-powered healthcare companion. Track, understand, and care for your body at every stage.</p>
          <div className="flex justify-center gap-6">
            <div className="text-center"><Heart className="w-6 h-6 mx-auto mb-1 text-white/70" /><p className="text-xs text-white/60">Trusted</p></div>
            <div className="text-center"><Sparkles className="w-6 h-6 mx-auto mb-1 text-white/70" /><p className="text-xs text-white/60">AI Powered</p></div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <Link href="/" className="absolute top-6 left-6 lg:left-auto lg:right-6 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Image src="/hermaa_logo.png" alt="HerMaa" width={80} height={80} className="mx-auto rounded-2xl mb-3" />
          </div>

          <h1 className="text-3xl font-bold text-hermaa-text mb-2">Sign In</h1>
          <p className="text-hermaa-muted mb-8">Welcome back! Continue your health journey.</p>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">⚠️ {error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-hermaa-text block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-text block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-12 pr-12 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hermaa-light hover:text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="/auth/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center my-6"><div className="flex-1 h-px bg-primary/10" /><span className="px-4 text-sm text-hermaa-light">or</span><div className="flex-1 h-px bg-primary/10" /></div>

          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white border border-primary/10 hover:bg-primary/3 transition-colors text-sm font-medium disabled:opacity-50">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-hermaa-muted mt-8">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
