"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Phone, HeartPulse, Shield, MapPin, Share2, Bell, AlertTriangle, Users, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function EmergencyPage() {
  const [locationShared, setLocationShared] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  function shareLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        if (navigator.share) {
          navigator.share({ title: "My Location - Emergency", text: "I need help! Here is my live location:", url: mapsUrl });
        } else {
          navigator.clipboard.writeText(mapsUrl);
        }
        setLocationShared(true);
        setTimeout(() => setLocationShared(false), 3000);
      });
    } else {
      alert("Location not available on this device.");
    }
  }

  function triggerSiren() {
    setSirenActive(true);
    // Play a loud alert sound using Web Audio
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.8;
    osc.start();
    // Alternate frequency for siren effect
    let freq = 800;
    const interval = setInterval(() => {
      freq = freq === 800 ? 1200 : 800;
      osc.frequency.value = freq;
    }, 300);
    setTimeout(() => {
      osc.stop();
      clearInterval(interval);
      setSirenActive(false);
    }, 5000);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${sirenActive ? "bg-red-50" : "bg-gradient-to-br from-background to-[#FFEBEE]/30"} p-4`}>
      <Link href="/dashboard" className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white shadow-glass flex items-center justify-center z-20">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="max-w-lg mx-auto pt-16 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div
            animate={sirenActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.05, 1] }}
            transition={{ duration: sirenActive ? 0.3 : 2, repeat: Infinity }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${sirenActive ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]" : "bg-cycle-menstrual/15"}`}
          >
            <AlertTriangle className={`w-10 h-10 ${sirenActive ? "text-white" : "text-cycle-menstrual"}`} />
          </motion.div>
          <h1 className="text-2xl font-bold">Emergency Support</h1>
          <p className="text-sm text-hermaa-muted mt-1">You&apos;re not alone. Help is just a tap away.</p>
        </motion.div>

        {/* Siren Button */}
        <motion.button
          onClick={triggerSiren}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${sirenActive ? "bg-red-600 text-white shadow-[0_0_60px_rgba(239,68,68,0.4)] animate-pulse" : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25"}`}
        >
          <Bell className="w-6 h-6" />
          {sirenActive ? "🔊 SIREN ACTIVE..." : "🚨 Activate Panic Siren"}
        </motion.button>

        {/* Emergency Call Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h3 className="font-semibold text-sm text-hermaa-muted">Emergency Helplines</h3>
          <EmergencyBtn href="tel:112" icon={<Phone />} label="Call 112" sub="National Emergency" color="bg-red-500" />
          <EmergencyBtn href="tel:1091" icon={<Image src="/hermaa_logo.png" alt="" width={28} height={28} className="rounded-lg" />} label="Women Helpline" sub="1091 — 24/7 support" color="bg-primary" />
          <EmergencyBtn href="tel:181" icon={<span className="text-2xl">🧑🏻‍⚕️</span>} label="Health Helpline" sub="181 — Medical emergency" color="bg-cycle-luteal" />
          <EmergencyBtn href="tel:1098" icon={<span className="text-2xl">👶🏻</span>} label="Child Helpline" sub="1098 — For minors" color="bg-cycle-ovulation" />
          <EmergencyBtn href="tel:100" icon={<Phone />} label="Police" sub="100 — Law enforcement" color="bg-gray-700" />
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <h3 className="font-semibold text-sm text-hermaa-muted">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={shareLocation}
              className="p-4 rounded-2xl bg-white shadow-sm border border-primary/10 hover:shadow-glass transition-all text-center"
            >
              <MapPin className={`w-6 h-6 mx-auto mb-2 ${locationShared ? "text-cycle-follicular" : "text-primary"}`} />
              <p className="text-xs font-semibold">{locationShared ? "✅ Shared!" : "Share Location"}</p>
              <p className="text-[10px] text-hermaa-light">Send to trusted contacts</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Emergency - HerMaa", text: "I need help urgently! Please check on me." });
                }
              }}
              className="p-4 rounded-2xl bg-white shadow-sm border border-primary/10 hover:shadow-glass transition-all text-center"
            >
              <Share2 className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-semibold">Send SOS Message</p>
              <p className="text-[10px] text-hermaa-light">Alert your contacts</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")}
              className="p-4 rounded-2xl bg-white shadow-sm border border-primary/10 hover:shadow-glass transition-all text-center"
            >
              <HeartPulse className="w-6 h-6 mx-auto mb-2 text-cycle-menstrual" />
              <p className="text-xs font-semibold">Nearby Hospitals</p>
              <p className="text-[10px] text-hermaa-light">Find on Google Maps</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("https://www.google.com/maps/search/police+station+near+me", "_blank")}
              className="p-4 rounded-2xl bg-white shadow-sm border border-primary/10 hover:shadow-glass transition-all text-center"
            >
              <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs font-semibold">Nearby Police</p>
              <p className="text-[10px] text-hermaa-light">Find on Google Maps</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Fake Call Feature */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("📞 Fake call incoming in 10 seconds... (This would trigger a fake incoming call UI to help you leave an uncomfortable situation safely)")}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 hover:shadow-glass transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Trigger Fake Call</p>
              <p className="text-xs text-hermaa-muted">Simulates an incoming call to help you exit an unsafe situation</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Safety Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-primary/5">
          <h3 className="font-semibold mb-3">🛡️ Safety Tips</h3>
          <ul className="space-y-2 text-sm text-hermaa-muted">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Share your live location with a trusted contact before going out</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Keep emergency numbers saved offline</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Inform someone about your plans and expected return time</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Stay in well-lit, populated areas when possible</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Trust your instincts — leave if something feels wrong</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Use the buddy system when traveling at night</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Keep your phone charged and accessible</li>
          </ul>
        </motion.div>

        <div className="pb-8" />
      </div>
    </div>
  );
}

function EmergencyBtn({ href, icon, label, sub, color }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-primary/5 hover:shadow-glass transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-hermaa-muted">{sub}</p>
      </div>
      <Phone className="w-5 h-5 text-hermaa-light" />
    </motion.a>
  );
}
