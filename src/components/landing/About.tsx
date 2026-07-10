"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Globe, Sparkles } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-gradient-to-b from-background to-[#F3E5F5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-[400px] h-[400px] sm:w-[480px] sm:h-[480px]"
            >
              {/* Background Circles */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse-soft" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15" />

              {/* Main Logo Circle */}
              <motion.div
                animate={{ y: [0, -12, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow overflow-hidden"
              >
                <Image
                  src="/favicon.png"
                  alt="HerMaa"
                  width={400}
                  height={400}
                  priority
                  className="object-contain w-52 h-52 sm:w-64 sm:h-64 drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating Glass Card - AI */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-white/60"
              >
                <p className="text-xs text-gray-500">AI Assistant</p>
                <p className="font-semibold text-primary text-sm">Ask HerMaa</p>
              </motion.div>

              {/* Floating Glass Card - Cycle */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 left-4 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-white/60"
              >
                <p className="text-xs text-gray-500">Next Period</p>
                <p className="font-semibold text-secondary text-sm">In 14 Days</p>
              </motion.div>

              {/* Floating Sparkles */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-lg rounded-xl p-3 shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>

              {/* Decorative Glow */}
              <div className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-pink-300/20 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary mb-4">
              💜 Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Mother&apos;s Care.<br />
              <span className="gradient-text">Daughter&apos;s Confidence.</span>
            </h2>
            <p className="text-lg text-hermaa-muted mb-4 leading-relaxed">
              HerMaa was born from a simple truth: every woman deserves access to reliable
              healthcare guidance, regardless of where she lives or what language she speaks.
            </p>
            <p className="text-lg text-hermaa-muted mb-8 leading-relaxed">
              We combine the warmth of a mother&apos;s care with the power of AI to create a
              companion that understands, supports, and empowers women at every stage of life.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <StatCard icon={<Globe className="w-6 h-6" />} value="9" label="Indian Languages" />
              <StatCard icon={<Shield className="w-6 h-6" />} value="24/7" label="AI Support" />
              <StatCard icon={<Heart className="w-6 h-6" />} value="100%" label="Privacy First" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
        {icon}
      </div>
      <p className="text-xl font-bold text-hermaa-text">{value}</p>
      <p className="text-xs text-hermaa-light">{label}</p>
    </div>
  );
}
