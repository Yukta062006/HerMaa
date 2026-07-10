"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Calendar } from "lucide-react";
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
    setLoading(true);
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (userExists(form.email)) {
      setError("An account with this email already exists. Please login instead.");
      setLoading(false);
      return;
    }

    // Register locally
    registerUser({ name: form.name, email: form.email, password: form.password, age: parseInt(form.age), language: form.language });

    // Get token from backend
    const result = await api.register(form.name, form.email, parseInt(form.age), form.language);
    if (result) {
      router.push("/dashboard");
    } else {
      // Backend offline — still allow with local session
      localStorage.setItem("hermaa_user", JSON.stringify({ name: form.name, email: form.email, age: parseInt(form.age), language: form.language }));
      localStorage.setItem("hermaa_token", "offline_session");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#FCE4EC]/30 to-[#F3E5F5]/40 flex items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white shadow-glass flex items-center justify-center hover:shadow-glass-lg transition-shadow">
        <ArrowLeft className="w-5 h-5 text-hermaa-text" />
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass-lg border border-white/40 p-8 sm:p-10">
          <div className="text-center mb-8">
            <Image src="/hermaa_logo.png" alt="HerMaa" width={130} height={130} className="mx-auto mb-4 rounded-3xl" />
            <h1 className="text-2xl font-bold text-hermaa-text">Join HerMaa</h1>
            <p className="text-sm text-hermaa-muted mt-1">Start your health journey today</p>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" min="10" max="70" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="gu">ગુજરાતી</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ml">മലయാളം</option>
                  <option value="pa">ਪੰਜਾਬੀ</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-hermaa-muted block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-hermaa-light hover:text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-hermaa-muted mt-6">
            Already have an account? <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
