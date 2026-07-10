"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Is HerMaa free to use?", a: "Yes! HerMaa is completely free for all core features including period tracking, cycle predictions, and AI health assistant. Premium features like advanced analytics are optional." },
  { q: "How does the AI assistant work?", a: "HerMaa AI is powered by Google Gemini. It provides personalized health guidance based on your cycle data, symptoms, and health profile. It supports 9 Indian languages and never stores your conversations on external servers." },
  { q: "Is my data private and secure?", a: "Absolutely. Your health data is encrypted end-to-end and stored securely in Firebase. We never sell your data or share it with third parties. You can delete all your data at any time." },
  { q: "Does it work without internet?", a: "Yes! HerMaa works fully offline for tracking, logging, and viewing your data. AI features require internet but cached responses are available offline. Data syncs automatically when you reconnect." },
  { q: "What languages are supported?", a: "HerMaa supports English, Hindi, Marathi, Gujarati, Tamil, Kannada, Malayalam, Punjabi, and Bengali. The AI assistant can respond in any of these languages." },
  { q: "Can I use HerMaa with my daughter?", a: "Yes! HerMaa is designed for women of all ages. Many mothers use it alongside their daughters to track cycles, learn about puberty, and have informed health conversations in a comfortable way." },
  { q: "How accurate are the predictions?", a: "Our ML-powered predictions achieve 87% accuracy for regular cycles and improve over time as you log more data. For irregular cycles, we provide ranges and recommend consulting a healthcare provider." },
  { q: "What if I have a medical emergency?", a: "HerMaa has a dedicated Emergency SOS feature with one-tap access to emergency services (112), Women Helpline (1091), and Health Helpline (181). It also allows you to share your live location with trusted contacts." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-gradient-to-b from-[#F3E5F5]/10 to-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary mb-4">
            ❓ FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/40 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-hermaa-text pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-5 text-sm text-hermaa-muted leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
