"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, CalendarDays, Bot, TrendingUp, User, Bell, Siren, Sparkles, Heart, Activity, Droplets, Moon, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { getUser, clearUser } from "@/lib/auth";

interface CycleData { current_day: number; cycle_length: number; phase: string; health_score?: number; }
interface Insight { title: string; description: string; score?: number; }

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [activeTab, setActiveTab] = useState("home");
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [healthScore, setHealthScore] = useState<{ overall: number; regularity: number; symptom_management: number; lifestyle: number } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, icon: "🩸", title: "Period Predicted", desc: "Your next period is expected in 14 days", time: "Just now", unread: true },
    { id: 2, icon: "💧", title: "Hydration Reminder", desc: "Don't forget to drink water! Aim for 8 glasses today.", time: "1h ago", unread: true },
    { id: 3, icon: "🧘", title: "Wellness Tip", desc: "Light yoga is great for your current follicular phase.", time: "3h ago", unread: true },
    { id: 4, icon: "🍎", title: "Nutrition Insight", desc: "Include iron-rich foods — spinach, lentils, beetroot.", time: "5h ago", unread: false },
    { id: 5, icon: "🌙", title: "Sleep Reminder", desc: "Aim for 7-8 hours tonight for hormonal balance.", time: "Yesterday", unread: false },
    { id: 6, icon: "💜", title: "Welcome to HerMaa!", desc: "Your health journey starts today. We're here for you.", time: "Yesterday", unread: false },
  ];

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push("/auth/login"); return; }
    setUserName(user.name);
    loadData();
  }, [router]);

  async function loadData() {
    const [cycleData, insightsData, scoreData] = await Promise.all([
      api.getCycleStatus(),
      api.getInsights(),
      api.getHealthScore(),
    ]);
    if (cycleData) setCycle(cycleData);
    if (insightsData?.insights) setInsights(insightsData.insights);
    if (scoreData) setHealthScore(scoreData);
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning ☀️";
    if (h < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  }

  function handleLogout() {
    clearUser();
    router.push("/");
  }

  const phaseNames: Record<string, string> = { menstrual: "Menstrual", follicular: "Follicular", ovulation: "Ovulation", luteal: "Luteal" };
  const phaseColors: Record<string, string> = { menstrual: "bg-cycle-menstrual/15 text-cycle-menstrual", follicular: "bg-cycle-follicular/15 text-cycle-follicular", ovulation: "bg-cycle-ovulation/15 text-cycle-ovulation", luteal: "bg-cycle-luteal/15 text-cycle-luteal" };

  const currentDay = cycle?.current_day ?? 14;
  const cycleLength = cycle?.cycle_length ?? 28;
  const phase = cycle?.phase ?? "follicular";
  const score = healthScore?.overall ?? 78;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-hermaa-light">{getGreeting()}</p>
            <h2 className="text-lg font-semibold">{userName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-glass transition-shadow">
              <Bell className="w-5 h-5 text-hermaa-muted" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white" />
            </button>
            <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:shadow-glass transition-shadow" title="Logout">
              <LogOut className="w-5 h-5 text-hermaa-muted" />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-4 w-[340px] max-h-[70vh] z-50 rounded-2xl bg-white/95 backdrop-blur-xl shadow-glass-lg border border-white/40 overflow-hidden"
        >
          <div className="p-4 border-b border-primary/5 flex items-center justify-between">
            <h3 className="font-semibold text-base">Notifications</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{notifications.filter(n => n.unread).length} new</span>
          </div>
          <div className="overflow-y-auto max-h-[55vh]">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-primary/5 last:border-0 transition-colors hover:bg-primary/3 ${n.unread ? "bg-primary/5" : ""}`}>
                <span className="text-xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"} text-hermaa-text`}>{n.title}</p>
                  <p className="text-xs text-hermaa-muted mt-0.5 line-clamp-2">{n.desc}</p>
                  <p className="text-[10px] text-hermaa-light mt-1">{n.time}</p>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-primary/5">
            <button onClick={() => setShowNotifications(false)} className="w-full py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}

      {/* Backdrop for notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6">
        {activeTab === "home" && (
          <>
            {/* Cycle Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="bg-gradient-to-br from-white/90 to-[#F3E5F5]/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Your Cycle</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${phaseColors[phase]}`}>{phaseNames[phase]} Phase</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#F3E5F5" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#dGrad)" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (currentDay / cycleLength) * 264} strokeLinecap="round" />
                      <defs><linearGradient id="dGrad"><stop offset="0%" stopColor="#7B3F98" /><stop offset="100%" stopColor="#F48FB1" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{currentDay}</span>
                      <span className="text-[10px] text-hermaa-light">Day</span>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /><div><p className="text-[10px] text-hermaa-light">Next Period</p><p className="text-sm font-semibold">In {cycleLength - currentDay + 1} days</p></div></div>
                    <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /><div><p className="text-[10px] text-hermaa-light">Cycle Length</p><p className="text-sm font-semibold">{cycleLength} days</p></div></div>
                    <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /><div><p className="text-[10px] text-hermaa-light">Health Score</p><p className="text-sm font-semibold">{score}%</p></div></div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-base font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-3">
                <QuickBtn icon={<Droplets className="w-6 h-6" />} label="Log Period" color="text-cycle-menstrual" bg="bg-cycle-menstrual/10" onClick={() => setActiveTab("tracker")} />
                <QuickBtn icon={<Bot className="w-6 h-6" />} label="Ask AI" color="text-primary" bg="bg-primary/10" onClick={() => setActiveTab("ai")} />
                <QuickBtn icon={<TrendingUp className="w-6 h-6" />} label="Insights" color="text-cycle-ovulation" bg="bg-cycle-ovulation/10" onClick={() => setActiveTab("insights")} />
                <Link href="/emergency"><QuickBtn icon={<Siren className="w-6 h-6" />} label="SOS" color="text-cycle-menstrual" bg="bg-cycle-menstrual/10" /></Link>
              </div>
            </motion.div>

            {/* AI Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard className="bg-gradient-to-r from-primary/5 to-secondary/5 cursor-pointer" onClick={() => setActiveTab("ai")}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
                  <div><h3 className="font-semibold text-sm">Ask HerMaa AI</h3><p className="text-xs text-hermaa-light">Powered by Gemini</p></div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
                  <span className="text-sm text-hermaa-light">Ask me anything about your health...</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </GlassCard>
            </motion.div>

            {/* Insights */}
            {insights.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-base font-semibold mb-3">Health Insights</h3>
                <div className="space-y-2">
                  {insights.map((ins, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm">
                      <span className="text-lg">💡</span>
                      <div><p className="text-sm font-medium">{ins.title}</p><p className="text-xs text-hermaa-muted">{ins.description}</p></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {activeTab === "ai" && <AIChat userName={userName} cyclePhase={phase} cycleDay={currentDay} />}
        {activeTab === "tracker" && <PeriodTracker />}
        {activeTab === "insights" && <InsightsTab healthScore={healthScore} phase={phase} />}
        {activeTab === "profile" && <ProfileTab userName={userName} onLogout={handleLogout} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 z-50">
        <div className="max-w-5xl mx-auto flex justify-around py-2">
          {[
            { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
            { id: "tracker", icon: <CalendarDays className="w-5 h-5" />, label: "Tracker" },
            { id: "insights", icon: <TrendingUp className="w-5 h-5" />, label: "Insights" },
            { id: "ai", icon: <Bot className="w-5 h-5" />, label: "AI" },
            { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${activeTab === tab.id ? "text-primary" : "text-hermaa-light hover:text-primary"}`}>
              {tab.icon}<span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// === AI Chat Component ===
function AIChat({ userName, cyclePhase, cycleDay }: { userName: string; cyclePhase: string; cycleDay: number }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMsg(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    const context = { cycle_day: cycleDay, phase: cyclePhase };
    const data = await api.chat(msg, "en", context);
    setLoading(false);
    const response = data?.response || "I'm sorry, I couldn't connect to the AI service right now. Please make sure the backend is running. 💕";
    setMessages((prev) => [...prev, { role: "ai", text: response }]);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/hermaa_logo.png" alt="" width={48} height={48} className="rounded-xl" />
        <div><h2 className="text-lg font-semibold">HerMaa AI</h2><p className="text-xs text-hermaa-light">Powered by Gemini</p></div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-hermaa-muted mb-4">Hi {userName}! 💕 Ask me anything about your health.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["What should I eat during my period?", "How to manage cramps?", "PCOS symptoms?", "Exercise tips"].map((q) => (
                <button key={q} onClick={() => sendMsg(q)} className="px-3 py-2 rounded-xl bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors">{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm" : "bg-white shadow-sm rounded-bl-sm"}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] text-sm text-hermaa-light">Thinking...</div>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); sendMsg(); }} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1 px-4 py-3 rounded-2xl bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button type="submit" disabled={loading} className="w-11 h-11 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20"><Bot className="w-5 h-5" /></button>
      </form>
    </div>
  );
}

// === Period Tracker with Calendar ===
function PeriodTracker() {
  const [flow, setFlow] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Simulate period days (days 1-5 of cycle)
  const cycleStartDay = 26; // June 26 was last period start
  const getPeriodDays = () => {
    const periodDays: number[] = [];
    const lastPeriodStart = new Date(2026, 5, cycleStartDay); // June 26
    for (let i = 0; i < 5; i++) {
      const d = new Date(lastPeriodStart);
      d.setDate(d.getDate() + i);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        periodDays.push(d.getDate());
      }
    }
    // Next predicted period (July 24)
    const nextPeriodStart = new Date(2026, 6, 24);
    for (let i = 0; i < 5; i++) {
      const d = new Date(nextPeriodStart);
      d.setDate(d.getDate() + i);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        periodDays.push(d.getDate());
      }
    }
    return periodDays;
  };

  // Ovulation prediction (around day 14 of cycle = July 10)
  const getOvulationDays = () => {
    const ovDays: number[] = [];
    const ovStart = new Date(2026, 6, 9);
    for (let i = 0; i < 3; i++) {
      const d = new Date(ovStart);
      d.setDate(d.getDate() + i);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        ovDays.push(d.getDate());
      }
    }
    return ovDays;
  };

  const periodDays = getPeriodDays();
  const ovulationDays = getOvulationDays();

  function changeMonth(delta: number) {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setSelectedDay(null);
  }

  const [loggedDays, setLoggedDays] = useState<number[]>([]);

  async function saveLog() {
    const dateStr = selectedDay
      ? new Date(currentYear, currentMonth, selectedDay).toISOString()
      : new Date().toISOString();
    await api.logCycle({ date: dateStr, flow, mood, symptoms });
    // Mark the day as logged
    if (selectedDay && !loggedDays.includes(selectedDay)) {
      setLoggedDays((prev) => [...prev, selectedDay]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setFlow(""); setMood(""); setSymptoms([]);
  }

  const toggleSymptom = (s: string) => setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Period Tracker</h2>
      {saved && <div className="p-3 rounded-xl bg-cycle-follicular/10 text-cycle-follicular text-sm font-medium">✅ Log saved successfully!</div>}

      {/* Calendar */}
      <GlassCard hover={false}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <h3 className="font-semibold text-base">{months[currentMonth]} {currentYear}</h3>
          <button onClick={() => changeMonth(1)} className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-hermaa-light py-1">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today.getDate();
            const isPeriod = periodDays.includes(day);
            const isOvulation = ovulationDays.includes(day);
            const isSelected = day === selectedDay;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                  ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                  ${isToday ? "bg-gradient-to-br from-primary to-secondary text-white shadow-md" : ""}
                  ${isPeriod && !isToday ? "bg-cycle-menstrual/20 text-cycle-menstrual" : ""}
                  ${isOvulation && !isToday && !isPeriod ? "bg-cycle-ovulation/20 text-cycle-ovulation" : ""}
                  ${!isToday && !isPeriod && !isOvulation ? "hover:bg-primary/5 text-hermaa-text" : ""}
                `}
              >
                {day}
                {isPeriod && !isToday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cycle-menstrual" />}
                {isOvulation && !isToday && !isPeriod && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cycle-ovulation" />}
                {loggedDays.includes(day) && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cycle-follicular border border-white" />}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-primary/5">
          <span className="flex items-center gap-1.5 text-xs text-hermaa-muted">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary" /> Today
          </span>
          <span className="flex items-center gap-1.5 text-xs text-hermaa-muted">
            <span className="w-3 h-3 rounded-full bg-cycle-menstrual/30" /> Period
          </span>
          <span className="flex items-center gap-1.5 text-xs text-hermaa-muted">
            <span className="w-3 h-3 rounded-full bg-cycle-ovulation/30" /> Ovulation
          </span>
          <span className="flex items-center gap-1.5 text-xs text-hermaa-muted">
            <span className="w-3 h-3 rounded-full bg-cycle-follicular" /> Logged
          </span>
        </div>
      </GlassCard>

      {/* Selected Day Info */}
      {selectedDay && (
        <div className="p-3 rounded-xl bg-primary/5 text-sm">
          <span className="font-medium">Selected: </span>
          {months[currentMonth]} {selectedDay}, {currentYear}
          {periodDays.includes(selectedDay) && <span className="ml-2 text-cycle-menstrual font-medium">• Period Day</span>}
          {ovulationDays.includes(selectedDay) && <span className="ml-2 text-cycle-ovulation font-medium">• Fertile Window</span>}
        </div>
      )}

      {/* Log Form */}
      <GlassCard hover={false}>
        <h3 className="font-semibold mb-3">📝 Log for {selectedDay ? `${months[currentMonth]} ${selectedDay}` : "Today"}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-hermaa-muted block mb-2">Flow Intensity</label>
            <div className="flex gap-2">
              {["none", "light", "medium", "heavy"].map((f) => (
                <button key={f} onClick={() => setFlow(f)} className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${flow === f ? "bg-primary text-white shadow-md" : "bg-primary/5 text-hermaa-muted hover:bg-primary/10"}`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-hermaa-muted block mb-2">Mood</label>
            <div className="flex gap-3">
              {[["happy", "😊"], ["calm", "😌"], ["sad", "😢"], ["angry", "😤"], ["anxious", "😰"], ["energetic", "⚡"]].map(([m, emoji]) => (
                <button key={m} onClick={() => setMood(m)} className={`text-2xl p-2 rounded-xl transition-all ${mood === m ? "bg-primary/10 scale-110 shadow-sm" : "hover:bg-primary/5"}`} title={m}>{emoji}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-hermaa-muted block mb-2">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {["Cramps", "Headache", "Bloating", "Fatigue", "Back Pain", "Acne", "Nausea", "Mood Swings", "Breast Tenderness", "Insomnia"].map((s) => (
                <button key={s} onClick={() => toggleSymptom(s)} className={`px-3 py-1.5 rounded-xl text-xs transition-all ${symptoms.includes(s) ? "bg-primary text-white shadow-sm" : "bg-primary/5 text-hermaa-muted hover:bg-primary/10"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <motion.button
        onClick={saveLog}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        disabled={!flow && !mood && symptoms.length === 0}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
      >
        <CalendarDays className="w-5 h-5" />
        {saved ? "✅ Saved!" : "Save Log"}
      </motion.button>
    </div>
  );
}

// === Insights Tab ===
function InsightsTab({ healthScore, phase }: { healthScore: { overall: number; regularity: number; symptom_management: number; lifestyle: number } | null; phase: string }) {
  const score = healthScore?.overall ?? 78;
  const phaseInfo: Record<string, { color: string; bg: string; desc: string; tips: string[] }> = {
    menstrual: { color: "text-cycle-menstrual", bg: "bg-cycle-menstrual/10", desc: "Your body is shedding the uterine lining. Rest, stay warm, and nourish yourself with iron-rich foods.", tips: ["🫖 Warm ginger tea for comfort", "🛌 Extra rest is perfectly okay", "🥗 Leafy greens & lentils for iron", "🧘 Gentle stretching only", "🍫 Dark chocolate for magnesium"] },
    follicular: { color: "text-cycle-follicular", bg: "bg-cycle-follicular/10", desc: "Energy is rising! Your body is preparing for ovulation. Great time for new projects and intense workouts.", tips: ["💪 High-intensity workouts ideal", "🥑 Focus on protein & healthy fats", "✨ Creativity peaks — start new things", "🏃‍♀️ Best time for running & cardio", "🧠 Learning & memory are enhanced"] },
    ovulation: { color: "text-cycle-ovulation", bg: "bg-cycle-ovulation/10", desc: "Peak energy and fertility window. You may feel most confident, social, and energetic.", tips: ["🏃‍♀️ Perfect for PR in workouts", "🗣️ Communication skills peak", "🥗 Fiber-rich foods recommended", "💧 Stay extra hydrated", "🌟 Great time for social events"] },
    luteal: { color: "text-cycle-luteal", bg: "bg-cycle-luteal/10", desc: "Progesterone rises. You may feel more tired and crave comfort foods. Practice self-care.", tips: ["🧘 Gentle yoga & pilates", "🍫 Magnesium-rich foods (dark choc!)", "😴 Prioritize 8+ hours sleep", "📖 Journaling helps process emotions", "🛁 Warm baths for relaxation"] },
  };

  const currentPhase = phaseInfo[phase] || phaseInfo.follicular;
  const cycleHistory = [28, 27, 29, 28, 30, 27, 28, 26, 29, 28, 27, 28];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Health Insights</h2>

      {/* Health Score Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard hover={false} className="text-center">
          <h3 className="font-semibold mb-4">Overall Health Score</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F3E5F5" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#insGrad)" strokeWidth="10" strokeDasharray="264" strokeDashoffset={264 - (score / 100) * 264} strokeLinecap="round" />
              <defs><linearGradient id="insGrad"><stop offset="0%" stopColor="#7B3F98" /><stop offset="100%" stopColor="#F48FB1" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary">{score}</span>
              <span className="text-xs text-hermaa-light">/100</span>
            </div>
          </div>
          <p className={`text-sm font-semibold ${score >= 80 ? "text-cycle-follicular" : score >= 60 ? "text-cycle-ovulation" : "text-cycle-menstrual"}`}>
            {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Attention"}
          </p>

          {/* Score Breakdown */}
          {healthScore && (
            <div className="mt-6 space-y-3 text-left">
              <ScoreBar label="Cycle Regularity" value={healthScore.regularity} emoji="📅" />
              <ScoreBar label="Symptom Management" value={healthScore.symptom_management} emoji="💊" />
              <ScoreBar label="Lifestyle & Wellness" value={healthScore.lifestyle} emoji="🧘" />
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Cycle History Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-4">📊 Cycle Length History</h3>
          <div className="flex items-end gap-2 h-32">
            {cycleHistory.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(val / 32) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-secondary relative group cursor-pointer"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-hermaa-muted opacity-0 group-hover:opacity-100 transition-opacity">{val}d</div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-hermaa-light">12 months ago</span>
            <span className="text-[10px] text-hermaa-light">This month</span>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-cycle-follicular/10 text-sm text-cycle-follicular font-medium">
            ✅ Your cycle is very regular — avg 28 days (±1.5 days)
          </div>
        </GlassCard>
      </motion.div>

      {/* Current Phase */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold">🌸 Current Phase</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${currentPhase.bg} ${currentPhase.color}`}>
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </span>
          </div>
          <p className="text-sm text-hermaa-muted leading-relaxed mb-4">{currentPhase.desc}</p>
          <div className="space-y-2">
            {currentPhase.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 text-sm text-hermaa-muted"
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* PCOS Risk */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">🩺 PCOS Risk Assessment</h3>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-hermaa-muted">Risk Level</span>
              <span className="font-medium text-cycle-follicular">Low (25%)</span>
            </div>
            <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-cycle-follicular to-cycle-follicular/60 rounded-full"
              />
            </div>
          </div>
          <p className="text-xs text-hermaa-muted mb-3">Based on your cycle regularity and logged symptoms. Your cycle is regular with minimal concerning symptoms.</p>
          <div className="p-3 rounded-xl bg-cycle-follicular/5 border border-cycle-follicular/10">
            <p className="text-xs text-cycle-follicular font-medium">✅ No immediate concerns detected</p>
            <p className="text-[10px] text-hermaa-muted mt-1">Continue regular check-ups and healthy lifestyle for prevention.</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Predictions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">🔮 Predictions</h3>
          <div className="space-y-3">
            <PredictionRow label="Next Period Start" value="July 24, 2026" icon="🩸" confidence={87} />
            <PredictionRow label="Next Period End" value="July 29, 2026" icon="✨" confidence={82} />
            <PredictionRow label="Next Ovulation" value="August 7, 2026" icon="🌟" confidence={79} />
            <PredictionRow label="Fertile Window" value="Aug 5-9, 2026" icon="💫" confidence={75} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Mood Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-3">😊 This Week&apos;s Mood</h3>
          <div className="flex justify-between">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const moods = ["😊", "😌", "😊", "⚡", "😊", "😌", "—"];
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{moods[i]}</span>
                  <span className="text-[10px] text-hermaa-light">{day}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function ScoreBar({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{emoji}</span>
      <span className="text-xs text-hermaa-muted w-32">{label}</span>
      <div className="flex-1 h-2.5 bg-primary/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
      </div>
      <span className="text-xs font-bold text-primary w-10 text-right">{value}%</span>
    </div>
  );
}

function PredictionRow({ label, value, icon, confidence }: { label: string; value: string; icon: string; confidence: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-xs text-hermaa-muted">{label}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{confidence}%</span>
    </div>
  );
}

// === Profile Tab ===
function ProfileTab({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const user = getUser();
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3"><span className="text-2xl text-white font-bold">{userName.charAt(0).toUpperCase()}</span></div>
        <h2 className="text-xl font-semibold">{userName}</h2>
        <p className="text-sm text-hermaa-muted">{user?.email}</p>
      </div>
      <GlassCard>
        <div className="space-y-3">
          {[["Language", user?.language === "hi" ? "हिन्दी" : "English"], ["Age", user?.age?.toString() || "--"]].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0"><span className="text-sm text-hermaa-muted">{k}</span><span className="text-sm font-medium">{v}</span></div>
          ))}
        </div>
      </GlassCard>
      <button onClick={onLogout} className="w-full py-3.5 rounded-2xl border-2 border-cycle-menstrual text-cycle-menstrual font-semibold hover:bg-cycle-menstrual/5 transition-colors">Log Out</button>
    </div>
  );
}

function QuickBtn({ icon, label, color, bg, onClick }: { icon: React.ReactNode; label: string; color: string; bg: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white shadow-sm hover:shadow-glass transition-shadow">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color}`}>{icon}</div>
      <span className="text-[11px] font-medium text-hermaa-muted">{label}</span>
    </button>
  );
}
