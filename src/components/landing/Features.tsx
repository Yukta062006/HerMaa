"use client";

import { motion } from "framer-motion";
import {
  CalendarDays, Bot, TrendingUp, HeartPulse,
  Utensils, Siren, WifiOff, Languages,
} from "lucide-react";

const features = [
  { icon: CalendarDays, title: "Period Tracking", desc: "Track your cycle with precision. Log flow, mood, and symptoms daily.", color: "#E57373", gradient: "from-[#E57373] to-[#FF8A80]" },
  { icon: Bot, title: "AI Health Assistant", desc: "Powered by Gemini AI. Get instant health guidance in your language.", color: "#7B3F98", gradient: "from-[#7B3F98] to-[#9B5FB8]" },
  { icon: TrendingUp, title: "Smart Predictions", desc: "ML-powered cycle predictions with 87% accuracy.", color: "#FFB74D", gradient: "from-[#FFB74D] to-[#FFA726]" },
  { icon: HeartPulse, title: "PCOS Awareness", desc: "Early detection indicators and lifestyle management tips.", color: "#E57399", gradient: "from-[#E57399] to-[#F48FB1]" },
  { icon: Utensils, title: "Nutrition Plans", desc: "Phase-based diet recommendations for optimal health.", color: "#81C784", gradient: "from-[#81C784] to-[#66BB6A]" },
  { icon: Siren, title: "Emergency SOS", desc: "One-tap access to emergency helplines and safety features.", color: "#E57373", gradient: "from-[#E57373] to-[#EF5350]" },
  { icon: WifiOff, title: "Works Offline", desc: "Full functionality without internet. Syncs when back online.", color: "#64B5F6", gradient: "from-[#64B5F6] to-[#42A5F5]" },
  { icon: Languages, title: "9 Languages", desc: "Hindi, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Bengali.", color: "#9B5FB8", gradient: "from-[#9B5FB8] to-[#7B3F98]" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/3 to-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary mb-4"
          >
            ✨ Features
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need for Your{" "}
            <span className="gradient-text">Health Journey</span>
          </h2>
          <p className="text-lg text-hermaa-muted max-w-2xl mx-auto">
            A complete healthcare companion designed with love and powered by AI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              {/* Animated purple border glow */}
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ padding: "1.5px" }}>
                <div className="w-full h-full rounded-3xl bg-white" />
              </div>

              {/* Card content */}
              <div className="relative rounded-3xl bg-white border border-purple-100/60 p-6 text-center h-full shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500">
                {/* Animated icon container */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  style={{ boxShadow: `0 8px 24px ${feature.color}30` }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] skew-x-12" />
                </div>

                <h3 className="text-base font-bold mb-2 text-hermaa-text group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm text-hermaa-muted leading-relaxed">{feature.desc}</p>

                {/* Bottom accent line */}
                <div className="mt-4 h-1 w-0 group-hover:w-12 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
