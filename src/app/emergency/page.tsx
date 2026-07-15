"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Phone, HeartPulse, Shield, MapPin, Share2, Bell, AlertTriangle, MessageCircle } from "lucide-react";
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
        if (navigator.share) navigator.share({ title: "My Location - Emergency", text: "I need help!", url: mapsUrl });
        else navigator.clipboard.writeText(mapsUrl);
        setLocationShared(true);
        setTimeout(() => setLocationShared(false), 3000);
      });
    }
  }

  function triggerSiren() {
    setSirenActive(true);
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 800; gain.gain.value = 0.8; osc.start();
    let freq = 800;
    const interval = setInterval(() => { freq = freq === 800 ? 1200 : 800; osc.frequency.value = freq; }, 300);
    setTimeout(() => { osc.stop(); clearInterval(interval); setSirenActive(false); }, 5000);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${sirenActive ? "bg-red-50" : "bg-background"}`}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-primary/5">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-6 py-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <Image src="/hermaa_logo.png" alt="HerMaa" width={36} height={36} className="rounded-lg" />
          <div>
            <h1 className="text-lg font-semibold">Emergency Support</h1>
            <p className="text-xs text-hermaa-light">Help is just a click away</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* 1. Alert Header */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div
            animate={sirenActive ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
            transition={{ duration: sirenActive ? 0.3 : 2, repeat: Infinity }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${sirenActive ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]" : "bg-cycle-menstrual/10"}`}
          >
            <AlertTriangle className={`w-10 h-10 ${sirenActive ? "text-white" : "text-cycle-menstrual"}`} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">You&apos;re Not Alone</h2>
          <p className="text-hermaa-muted max-w-lg mx-auto">If you&apos;re in immediate danger, activate the siren or call emergency services below.</p>
        </motion.section>

        {/* 2. Panic Siren */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <motion.button
            onClick={triggerSiren}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${sirenActive ? "bg-red-600 text-white shadow-[0_0_60px_rgba(239,68,68,0.4)] animate-pulse" : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl"}`}
          >
            <Bell className="w-6 h-6" />
            {sirenActive ? "🔊 SIREN ACTIVE..." : "🚨 Activate Panic Siren"}
          </motion.button>
        </motion.section>

        {/* 3. Emergency Helplines */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Helplines</h3>
          <div className="space-y-3">
            <HelplineCard href="tel:112" icon={<Phone className="w-6 h-6" />} label="Call 112" sub="National Emergency — Police, Fire, Ambulance" color="bg-red-500" />
            <HelplineCard href="tel:1091" icon={<Image src="/hermaa_logo.png" alt="" width={28} height={28} className="rounded-lg" />} label="Women Helpline" sub="1091 — 24/7 support for women in distress" color="bg-primary" />
            <HelplineCard href="tel:181" icon={<span className="text-2xl">🧑🏻‍⚕️</span>} label="Health Helpline" sub="181 — Medical emergency assistance" color="bg-cycle-luteal" />
            <HelplineCard href="tel:1098" icon={<span className="text-2xl">👶🏻</span>} label="Child Helpline" sub="1098 — Protection for children & minors" color="bg-cycle-ovulation" />
            <HelplineCard href="tel:100" icon={<Phone className="w-6 h-6" />} label="Police" sub="100 — Law enforcement & crime reporting" color="bg-gray-700" />
          </div>
        </motion.section>

        {/* 4. Quick Actions */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard icon={<MapPin className={`w-7 h-7 ${locationShared ? "text-cycle-follicular" : "text-primary"}`} />} label={locationShared ? "✅ Shared!" : "Share Location"} sub="Send GPS to contacts" onClick={shareLocation} />
            <ActionCard icon={<Share2 className="w-7 h-7 text-primary" />} label="SOS Message" sub="Alert your contacts" onClick={() => { if (navigator.share) navigator.share({ title: "Emergency", text: "I need help urgently!" }); }} />
            <ActionCard icon={<HeartPulse className="w-7 h-7 text-cycle-menstrual" />} label="Nearby Hospitals" sub="Open in Google Maps" onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")} />
            <ActionCard icon={<Shield className="w-7 h-7 text-gray-600" />} label="Nearby Police" sub="Open in Google Maps" onClick={() => window.open("https://www.google.com/maps/search/police+station+near+me", "_blank")} />
          </div>
        </motion.section>

        {/* 5. Fake Call */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => alert("📞 Fake call incoming in 10 seconds...")} className="w-full p-6 rounded-2xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Trigger Fake Call</p>
              <p className="text-sm text-hermaa-muted">Simulates an incoming call to help you exit an unsafe situation discreetly</p>
            </div>
          </motion.button>
        </motion.section>

        {/* 6. Safety Tips */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="p-8 rounded-2xl bg-white border border-primary/5 shadow-sm">
            <h3 className="text-lg font-semibold mb-5">🛡️ Safety Tips</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Share your live location with a trusted contact before going out",
                "Keep emergency numbers saved offline on your phone",
                "Inform someone about your plans and expected return time",
                "Stay in well-lit, populated areas when possible",
                "Trust your instincts — leave if something feels wrong",
                "Use the buddy system when traveling at night",
                "Keep your phone charged and easily accessible",
                "Learn basic self-defense techniques",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span className="text-sm text-hermaa-muted">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function HelplineCard({ href, icon, label, sub, color }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string }) {
  return (
    <motion.a href={href} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-primary/5 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>{icon}</div>
      <div className="flex-1">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-hermaa-muted">{sub}</p>
      </div>
      <Phone className="w-5 h-5 text-hermaa-light" />
    </motion.a>
  );
}

function ActionCard({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} className="p-5 rounded-2xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all text-center w-full">
      <div className="mx-auto mb-2">{icon}</div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-hermaa-light mt-1">{sub}</p>
    </motion.button>
  );
}
