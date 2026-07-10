"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#FCE4EC]/30 to-[#F3E5F5]/40 flex items-center justify-center p-4">
      <Link href="/auth/login" className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white shadow-glass flex items-center justify-center hover:shadow-glass-lg transition-shadow">
        <ArrowLeft className="w-5 h-5 text-hermaa-text" />
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass-lg border border-white/40 p-8 sm:p-10 text-center">
          <Image src="/hermaa_logo.png" alt="HerMaa" width={80} height={80} className="mx-auto mb-4 rounded-2xl" />

          {!sent ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-sm text-hermaa-muted mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hermaa-light" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F4FC] border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <Button type="submit" className="w-full" size="lg">Send Reset Link</Button>
              </form>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-cycle-follicular mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-sm text-hermaa-muted mb-6">We&apos;ve sent a password reset link to <strong>{email}</strong></p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
