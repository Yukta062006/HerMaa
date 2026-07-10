"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Shield, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-[#FCE4EC]/30 to-[#F3E5F5]/40">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/3 to-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ women across India</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              From Her First{" "}
              <span className="gradient-text">Period</span> to Every Stage of{" "}
              <span className="gradient-text">Life.</span>
            </h1>

            <p className="text-lg sm:text-xl text-hermaa-muted max-w-xl mb-8 leading-relaxed">
              Your AI-powered healthcare companion. Track periods, get personalized
              insights, and access expert guidance — in 9 Indian languages.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/auth/signup">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <Stat icon={<Users className="w-5 h-5" />} value="10K+" label="Active Users" />
              <Stat icon={<Shield className="w-5 h-5" />} value="100%" label="Private & Secure" />
              <Stat icon={<Globe className="w-5 h-5" />} value="9" label="Languages" />
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center items-center"
          >
            {/* Background Glow */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 blur-3xl"
            />

            {/* Hero Image - Large */}
            <motion.div
              animate={{ y: [0, -14, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Image
                src="/hero_illustration.png"
                alt="HerMaa App"
                width={2000}
                height={2000}
                priority
                className="w-[380px] sm:w-[480px] lg:w-[580px] h-auto drop-shadow-[0_35px_80px_rgba(155,89,182,0.35)]"
              />
            </motion.div>

            {/* Soft Floating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[620px] h-[620px] rounded-full border border-primary/10"
            />

            {/* Floating Purple Heart */}
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-6 z-20"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl flex items-center justify-center border border-white/50">
                <span className="text-2xl">💜</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
  
}


function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-hermaa-text">{value}</p>
        <p className="text-xs text-hermaa-light">{label}</p>
      </div>
    </div>
  );
}
