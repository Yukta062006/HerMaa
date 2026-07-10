"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className, hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-glass p-6",
        "transition-shadow duration-300 hover:shadow-glass-lg",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
