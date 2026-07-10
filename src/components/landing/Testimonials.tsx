"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const testimonials = [
  { name: "Priya Sharma", age: 19, location: "Delhi", text: "HerMaa helped me understand my cycle for the first time. The AI assistant answers all my questions in Hindi!", avatar: "P", rating: 5 },
  { name: "Ananya Patel", age: 24, location: "Mumbai", text: "The PCOS awareness feature flagged symptoms I didn't know were connected. Now I'm getting proper treatment.", avatar: "A", rating: 5 },
  { name: "Kavitha R.", age: 32, location: "Chennai", text: "As a mother, I use HerMaa with my daughter. It makes those conversations so much easier. Available in Tamil too!", avatar: "K", rating: 5 },
  { name: "Sneha Reddy", age: 21, location: "Hyderabad", text: "The period predictions are so accurate! I love that it works offline in my village where internet is spotty.", avatar: "S", rating: 5 },
  { name: "Ritu Gupta", age: 28, location: "Jaipur", text: "Emergency SOS feature gave me peace of mind when travelling alone. Every woman should have this app.", avatar: "R", rating: 5 },
  { name: "Meera Nair", age: 26, location: "Kochi", text: "The nutrition recommendations change based on my cycle phase. So thoughtful and genuinely helpful!", avatar: "M", rating: 5 },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary mb-4">
            💕 Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Loved by <span className="gradient-text">Women</span> Across India
          </h2>
          <p className="text-lg text-hermaa-muted max-w-2xl mx-auto">
            Real stories from real women who trust HerMaa
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-hermaa-muted leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}, {t.age}</p>
                    <p className="text-xs text-hermaa-light">{t.location}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
