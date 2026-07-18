"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Calendar, Heart, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { userExists, registerUser } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", age: "", password: "", language: "en" });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    if (userExists(form.email)) { setError("Account already exists. Please login."); setLoading(false); return; }
    registerUser({ name: form.name, email: form.email, password: form.password, age: parseInt(form.age), language: form.language });
    const result = await api.register(form.name, form.email, parseInt(form.age), form.language);
    if (result) router.push("/dashboard");
    else { localStorage.setItem("hermaa_user", JSON.stringify({ name: form.name, email: form.email, age: parseInt(form.age), language: form.language })); localStorage.setItem("hermaa_token", "offline"); router.push("/dashboard"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-accent to-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Image src="/logo.png" alt="HerMaa" width={160} height={160} className="mx-auto mb-8 rounded-3xl shadow-2xl" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Join HerMaa</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">Start your health journey today. Track, learn, and grow with a companion that truly cares.</p>
          <div className="flex justify-center gap-6">
            <div className="text-center"><Heart className="w-6 h-6 mx-auto mb-1 text-white/70" /><p className="text-xs text-white/60">Free Forever</p></div>
            <div className="text-center"><Shield className="w-6 h-6 mx-auto mb-1 text-white/70" /><p className="text-xs text-white/60">100% Private</p></div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <Link href="/" className="absolute top-6 left-6 lg:left-auto lg:right-6 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <Image src="/hermaa_logo.png" alt="HerMaa" width={80} height={80} className="mx-auto rounded-2xl mb-3" />
          </div>

          <h1 className="text-3xl font-bold text-hermaa-text mb-2">Create Account</h1>
          <p className="text-hermaa-muted mb-8">Start your health journey — it&apos;s free.</p>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">⚠️ {error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-hermaa-text block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-text block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-hermaa-text block mb-2">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" min="10" max="70" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-hermaa-text block mb-2">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-4 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option><option value="ta">தமிழ்</option><option value="gu">ગુજરાતી</option><option value="kn">ಕನ್ನಡ</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="bn">বাংলা</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-text block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="w-full pl-12 pr-12 py-4 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hermaa-light hover:text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-hermaa-muted mt-8">
            Already have an account? <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
