"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, CalendarDays, Bot, TrendingUp, User, Bell, Siren, Sparkles, Heart, Activity, Droplets, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { getUser, clearUser } from "@/lib/auth";
import { t, getUserLanguage } from "@/lib/i18n";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState("en");

  const notifications = [
    { id: 1, icon: "🩸", title: "Period Predicted", desc: "Your next period is expected in 14 days", time: "Just now", unread: true },
    { id: 2, icon: "💧", title: "Hydration Reminder", desc: "Don't forget to drink water!", time: "1h ago", unread: true },
    { id: 3, icon: "🧘", title: "Wellness Tip", desc: "Light yoga is great for your current phase.", time: "3h ago", unread: true },
    { id: 4, icon: "🍎", title: "Nutrition Insight", desc: "Include iron-rich foods today.", time: "5h ago", unread: false },
    { id: 5, icon: "🌙", title: "Sleep Reminder", desc: "Aim for 7-8 hours tonight.", time: "Yesterday", unread: false },
  ];

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push("/auth/login"); return; }
    setUserName(user.name);
    setLang(getUserLanguage());
    loadData();
  }, [router]);

  async function loadData() {
    const [cycleData, insightsData, scoreData] = await Promise.all([
      api.getCycleStatus(), api.getInsights(), api.getHealthScore(),
    ]);
    if (cycleData) setCycle(cycleData);
    if (insightsData?.insights) setInsights(insightsData.insights);
    if (scoreData) setHealthScore(scoreData);
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return t("goodMorning", lang);
    if (h < 17) return t("goodAfternoon", lang);
    return t("goodEvening", lang);
  }

  function handleLogout() { clearUser(); router.push("/"); }

  const phaseNames: Record<string, string> = { menstrual: "Menstrual", follicular: "Follicular", ovulation: "Ovulation", luteal: "Luteal" };
  const phaseColors: Record<string, string> = { menstrual: "bg-cycle-menstrual/15 text-cycle-menstrual", follicular: "bg-cycle-follicular/15 text-cycle-follicular", ovulation: "bg-cycle-ovulation/15 text-cycle-ovulation", luteal: "bg-cycle-luteal/15 text-cycle-luteal" };
  const currentDay = cycle?.current_day ?? 14;
  const cycleLength = cycle?.cycle_length ?? 28;
  const phase = cycle?.phase ?? "follicular";
  const score = healthScore?.overall ?? 78;

  const navItems = [
    { id: "home", icon: Home, label: t("dashboard", lang) },
    { id: "tracker", icon: CalendarDays, label: t("periodTracker", lang) },
    { id: "insights", icon: TrendingUp, label: t("healthInsights", lang) },
    { id: "ai", icon: Bot, label: t("aiAssistant", lang) },
    { id: "profile", icon: User, label: t("profile", lang) },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} flex flex-col bg-white border-r border-primary/5 transition-all duration-300 fixed h-full z-30`}>
        <div className="p-4 flex items-center gap-3 border-b border-primary/5">
          <Image src="/hermaa_logo.png" alt="HerMaa" width={40} height={40} className="rounded-xl flex-shrink-0" />
          {sidebarOpen && <span className="text-lg font-bold gradient-text">HerMaa</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-gradient-to-r from-primary/10 to-secondary/5 text-primary" : "text-hermaa-muted hover:bg-primary/5 hover:text-primary"}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
          <Link href="/emergency" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-cycle-menstrual hover:bg-cycle-menstrual/5 transition-all">
            <Siren className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{t("emergencySOS", lang)}</span>}
          </Link>
        </nav>
        <div className="p-3 border-t border-primary/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-hermaa-muted hover:bg-red-50 hover:text-cycle-menstrual transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{t("logOut", lang)}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-primary/5">
          <div className="flex items-center justify-between px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
                {sidebarOpen ? <X className="w-4 h-4 text-primary" /> : <Menu className="w-4 h-4 text-primary" />}
              </button>
              <div>
                <p className="text-xs text-hermaa-light">{getGreeting()}</p>
                <h1 className="text-lg font-semibold">{userName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Bell className="w-5 h-5 text-hermaa-muted" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-16 right-6 w-[360px] z-40 rounded-2xl bg-white shadow-glass-lg border border-primary/10 overflow-hidden">
              <div className="p-4 border-b border-primary/5 flex justify-between items-center">
                <h3 className="font-semibold">{t("notifications", lang)}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{notifications.filter(n => n.unread).length} new</span>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-primary/5 last:border-0 ${n.unread ? "bg-primary/3" : ""}`}>
                    <span className="text-xl">{n.icon}</span>
                    <div className="flex-1"><p className={`text-sm ${n.unread ? "font-semibold" : ""}`}>{n.title}</p><p className="text-xs text-hermaa-muted">{n.desc}</p><p className="text-[10px] text-hermaa-light mt-1">{n.time}</p></div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Page Content */}
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {activeTab === "home" && <DashboardHome cycle={{ currentDay, cycleLength, phase, score }} insights={insights} setActiveTab={setActiveTab} lang={lang} />}
          {activeTab === "ai" && <AIChat userName={userName} cyclePhase={phase} cycleDay={currentDay} lang={lang} />}
          {activeTab === "tracker" && <PeriodTracker lang={lang} />}
          {activeTab === "insights" && <InsightsTab healthScore={healthScore} phase={phase} lang={lang} />}
          {activeTab === "profile" && <ProfileTab userName={userName} onLogout={handleLogout} lang={lang} />}
        </main>
      </div>

      {/* No mobile bottom nav — website uses top nav only */}
    </div>
  );
}

// === Dashboard Home ===
function DashboardHome({ cycle, insights, setActiveTab, lang }: { cycle: { currentDay: number; cycleLength: number; phase: string; score: number }; insights: Insight[]; setActiveTab: (t: string) => void; lang: string }) {
  const phaseNames: Record<string, string> = { menstrual: "Menstrual", follicular: "Follicular", ovulation: "Ovulation", luteal: "Luteal" };
  const phaseColors: Record<string, string> = { menstrual: "bg-cycle-menstrual/15 text-cycle-menstrual", follicular: "bg-cycle-follicular/15 text-cycle-follicular", ovulation: "bg-cycle-ovulation/15 text-cycle-ovulation", luteal: "bg-cycle-luteal/15 text-cycle-luteal" };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("cycleDay", lang)} value={`${t("cycleDay", lang)} ${cycle.currentDay}`} sub={`of ${cycle.cycleLength}`} icon={<CalendarDays className="w-5 h-5" />} color="text-primary" bg="bg-primary/10" />
        <StatCard label={t("currentPhase", lang)} value={`${phaseNames[cycle.phase]}`} sub={t("currentPhase", lang)} icon={<Heart className="w-5 h-5" />} color="text-cycle-follicular" bg="bg-cycle-follicular/10" />
        <StatCard label={t("nextPeriod", lang)} value={`${cycle.cycleLength - cycle.currentDay + 1}`} sub={t("nextPeriod", lang)} icon={<Droplets className="w-5 h-5" />} color="text-cycle-menstrual" bg="bg-cycle-menstrual/10" />
        <StatCard label={t("healthScore", lang)} value={`${cycle.score}%`} sub={t("healthScore", lang)} icon={<Activity className="w-5 h-5" />} color="text-primary" bg="bg-primary/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cycle Progress */}
        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t("cycleOverview", lang)}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${phaseColors[cycle.phase]}`}>{phaseNames[cycle.phase]} Phase</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F3E5F5" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#dGrad2)" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (cycle.currentDay / cycle.cycleLength) * 264} strokeLinecap="round" />
                <defs><linearGradient id="dGrad2"><stop offset="0%" stopColor="#7B3F98" /><stop offset="100%" stopColor="#F48FB1" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-primary">{cycle.currentDay}</span>
                <span className="text-xs text-hermaa-light">of {cycle.cycleLength}</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between text-sm"><span className="text-hermaa-muted">Cycle Progress</span><span className="font-medium">{Math.round((cycle.currentDay / cycle.cycleLength) * 100)}%</span></div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${(cycle.currentDay / cycle.cycleLength) * 100}%` }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-primary/5"><p className="text-[10px] text-hermaa-light">Next Period</p><p className="text-sm font-semibold">In {cycle.cycleLength - cycle.currentDay + 1} days</p></div>
                <div className="p-3 rounded-xl bg-cycle-follicular/5"><p className="text-[10px] text-hermaa-light">Health Score</p><p className="text-sm font-semibold text-cycle-follicular">{cycle.score}/100</p></div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* AI Assistant Card */}
        <GlassCard hover={false} onClick={() => setActiveTab("ai")} className="cursor-pointer hover:shadow-glass-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">HerMaa AI</h3>
              <p className="text-xs text-hermaa-light">Powered by Gemini</p>
            </div>
          </div>
          <p className="text-sm text-hermaa-muted mb-4">Get personalized health advice, nutrition tips, and cycle insights.</p>
          <div className="flex items-center justify-between bg-primary/5 rounded-xl px-4 py-3">
            <span className="text-sm text-hermaa-light">Ask anything...</span>
            <Bot className="w-4 h-4 text-primary" />
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions + Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-4">{t("quickActions", lang)}</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActiveTab("tracker")} className="p-4 rounded-2xl bg-cycle-menstrual/5 hover:bg-cycle-menstrual/10 transition-colors text-left">
              <Droplets className="w-6 h-6 text-cycle-menstrual mb-2" />
              <p className="text-sm font-medium">{t("logPeriod", lang)}</p>
              <p className="text-xs text-hermaa-light">{t("trackFlow", lang)}</p>
            </button>
            <button onClick={() => setActiveTab("ai")} className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors text-left">
              <Bot className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm font-medium">{t("askAI", lang)}</p>
              <p className="text-xs text-hermaa-light">{t("getAdvice", lang)}</p>
            </button>
            <button onClick={() => setActiveTab("insights")} className="p-4 rounded-2xl bg-cycle-ovulation/5 hover:bg-cycle-ovulation/10 transition-colors text-left">
              <TrendingUp className="w-6 h-6 text-cycle-ovulation mb-2" />
              <p className="text-sm font-medium">{t("insights", lang)}</p>
              <p className="text-xs text-hermaa-light">{t("viewAnalytics", lang)}</p>
            </button>
            <Link href="/emergency" className="p-4 rounded-2xl bg-cycle-menstrual/5 hover:bg-cycle-menstrual/10 transition-colors text-left">
              <Siren className="w-6 h-6 text-cycle-menstrual mb-2" />
              <p className="text-sm font-medium">{t("emergency", lang)}</p>
              <p className="text-xs text-hermaa-light">{t("sosHelplines", lang)}</p>
            </Link>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="font-semibold mb-4">{t("todayInsights", lang)}</h3>
          <div className="space-y-3">
            {insights.length > 0 ? insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/3">
                <span className="text-lg">💡</span>
                <div><p className="text-sm font-medium">{ins.title}</p><p className="text-xs text-hermaa-muted">{ins.description}</p></div>
              </div>
            )) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/3"><span>💧</span><span className="text-sm text-hermaa-muted">Stay hydrated — drink 8 glasses today</span></div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/3"><span>🧘</span><span className="text-sm text-hermaa-muted">Light yoga recommended for this phase</span></div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/3"><span>🍎</span><span className="text-sm text-hermaa-muted">Include iron-rich foods in your diet</span></div>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, bg }: { label: string; value: string; sub: string; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-white border border-primary/5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-hermaa-light font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-hermaa-text">{value}</p>
      <p className="text-xs text-hermaa-light">{sub}</p>
    </motion.div>
  );
}


// === AI Chat ===
function AIChat({ userName, cyclePhase, cycleDay, lang }: { userName: string; cyclePhase: string; cycleDay: number; lang: string }) {
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
    const data = await api.chat(msg, lang, context);
    setLoading(false);
    const response = data?.response || "I couldn't connect to the AI service. Please ensure the backend is running. 💕";
    setMessages((prev) => [...prev, { role: "ai", text: response }]);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Image src="/hermaa_logo.png" alt="" width={44} height={44} className="rounded-xl" />
        <div><h2 className="text-xl font-semibold">HerMaa AI Assistant</h2><p className="text-sm text-hermaa-light">Powered by Gemini — Ask anything about your health</p></div>
      </div>
      <div className="bg-white rounded-2xl border border-primary/5 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 240px)" }}>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-hermaa-muted mb-6">Hi {userName}! 💕 How can I help you today?</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                  {["What should I eat during my period?", "How to manage cramps?", "PCOS symptoms?", "Exercise tips", "Sleep advice", "Stress management"].map((q) => (
                    <button key={q} onClick={() => sendMsg(q)} className="px-4 py-2 rounded-xl bg-primary/5 text-sm text-primary hover:bg-primary/10 transition-colors">{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-gradient-to-r from-primary to-secondary text-white rounded-br-md" : "bg-primary/5 rounded-bl-md"}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="bg-primary/5 rounded-2xl rounded-bl-md px-5 py-3 max-w-[70%] text-sm text-hermaa-light animate-pulse">Thinking...</div>}
          </div>
          <div className="p-4 border-t border-primary/5">
            <form onSubmit={(e) => { e.preventDefault(); sendMsg(); }} className="flex gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about your health..." className="flex-1 px-5 py-3 rounded-xl bg-primary/5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <button type="submit" disabled={loading} className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


// === Period Tracker ===
function PeriodTracker({ lang }: { lang: string }) {
  const [flow, setFlow] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [loggedDays, setLoggedDays] = useState<number[]>([]);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
  const periodDays = [24, 25, 26, 27, 28]; // predicted
  const ovulationDays = [9, 10, 11];

  function changeMonth(delta: number) { let m = currentMonth + delta, y = currentYear; if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; } setCurrentMonth(m); setCurrentYear(y); setSelectedDay(null); }
  const toggleSymptom = (s: string) => setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  async function saveLog() {
    const dateStr = selectedDay ? new Date(currentYear, currentMonth, selectedDay).toISOString() : new Date().toISOString();
    await api.logCycle({ date: dateStr, flow, mood, symptoms });
    if (selectedDay) setLoggedDays((prev) => [...prev, selectedDay]);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
    setFlow(""); setMood(""); setSymptoms([]);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{t("periodTracker", lang)}</h2>
      {saved && <div className="mb-4 p-3 rounded-xl bg-cycle-follicular/10 text-cycle-follicular text-sm font-medium">✅ Log saved successfully!</div>}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <GlassCard hover={false}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10"><ChevronLeft className="w-5 h-5 text-primary" /></button>
            <h3 className="font-semibold">{months[currentMonth]} {currentYear}</h3>
            <button onClick={() => changeMonth(1)} className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary/10"><ChevronRight className="w-5 h-5 text-primary" /></button>
          </div>
          <div className="grid grid-cols-7 mb-2">{weekDays.map((d) => <div key={d} className="text-center text-xs font-medium text-hermaa-light py-1">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = isCurrentMonth && day === today.getDate();
              const isPeriod = periodDays.includes(day);
              const isOv = ovulationDays.includes(day);
              const isSelected = day === selectedDay;
              return (
                <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""} ${isToday ? "bg-gradient-to-br from-primary to-secondary text-white" : ""} ${isPeriod && !isToday ? "bg-cycle-menstrual/20 text-cycle-menstrual" : ""} ${isOv && !isToday && !isPeriod ? "bg-cycle-ovulation/20 text-cycle-ovulation" : ""} ${!isToday && !isPeriod && !isOv ? "hover:bg-primary/5" : ""}`}>
                  {day}
                  {loggedDays.includes(day) && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cycle-follicular border border-white" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-primary/5">
            <span className="flex items-center gap-1.5 text-xs text-hermaa-muted"><span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary" /> Today</span>
            <span className="flex items-center gap-1.5 text-xs text-hermaa-muted"><span className="w-3 h-3 rounded-full bg-cycle-menstrual/30" /> Period</span>
            <span className="flex items-center gap-1.5 text-xs text-hermaa-muted"><span className="w-3 h-3 rounded-full bg-cycle-ovulation/30" /> Ovulation</span>
          </div>
        </GlassCard>

        {/* Log Form */}
        <div className="space-y-4">
          <GlassCard hover={false}>
            <h3 className="font-semibold mb-3">📝 Log for {selectedDay ? `${months[currentMonth]} ${selectedDay}` : "Today"}</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-hermaa-muted block mb-2">{t("flow", lang)}</label><div className="flex gap-2">{(["none","light","medium","heavy"] as const).map(f => <button key={f} onClick={() => setFlow(f)} className={`px-4 py-2 rounded-xl text-sm ${flow === f ? "bg-primary text-white" : "bg-primary/5 text-hermaa-muted hover:bg-primary/10"}`}>{t(f, lang)}</button>)}</div></div>
              <div><label className="text-xs font-medium text-hermaa-muted block mb-2">{t("mood", lang)}</label><div className="flex gap-3">{[["happy","😊"],["calm","😌"],["sad","😢"],["angry","😤"],["anxious","😰"]].map(([m,e]) => <button key={m} onClick={() => setMood(m)} className={`text-2xl p-2 rounded-xl ${mood === m ? "bg-primary/10 scale-110" : "hover:bg-primary/5"}`}>{e}</button>)}</div></div>
              <div><label className="text-xs font-medium text-hermaa-muted block mb-2">{t("symptoms", lang)}</label><div className="flex flex-wrap gap-2">{["Cramps","Headache","Bloating","Fatigue","Back Pain","Acne","Nausea","Mood Swings"].map(s => <button key={s} onClick={() => toggleSymptom(s)} className={`px-3 py-1.5 rounded-xl text-xs ${symptoms.includes(s) ? "bg-primary text-white" : "bg-primary/5 text-hermaa-muted hover:bg-primary/10"}`}>{s}</button>)}</div></div>
            </div>
          </GlassCard>
          <motion.button onClick={saveLog} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!flow && !mood && symptoms.length === 0} className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <CalendarDays className="w-5 h-5" /> {saved ? t("saved", lang) : t("saveLog", lang)}
          </motion.button>
        </div>
      </div>
    </div>
  );
}


// === Insights ===
function InsightsTab({ healthScore, phase, lang }: { healthScore: { overall: number; regularity: number; symptom_management: number; lifestyle: number } | null; phase: string; lang: string }) {
  const score = healthScore?.overall ?? 78;
  const cycleHistory = [28, 27, 29, 28, 30, 27, 28, 26, 29, 28, 27, 28];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Health Insights</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard hover={false} className="text-center">
          <h3 className="font-semibold mb-4">{t("healthScore", lang)}</h3>
          <div className="relative w-32 h-32 mx-auto mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="#F3E5F5" strokeWidth="10" /><circle cx="50" cy="50" r="42" fill="none" stroke="url(#insG)" strokeWidth="10" strokeDasharray="264" strokeDashoffset={264 - (score / 100) * 264} strokeLinecap="round" /><defs><linearGradient id="insG"><stop offset="0%" stopColor="#7B3F98" /><stop offset="100%" stopColor="#F48FB1" /></linearGradient></defs></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-bold text-primary">{score}</span><span className="text-xs text-hermaa-light">/100</span></div>
          </div>
          {healthScore && <div className="space-y-2 text-left"><ScoreBar label="Regularity" value={healthScore.regularity} /><ScoreBar label="Symptoms" value={healthScore.symptom_management} /><ScoreBar label="Lifestyle" value={healthScore.lifestyle} /></div>}
        </GlassCard>

        <GlassCard hover={false} className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Cycle Length History (12 months)</h3>
          <div className="flex items-end gap-2 h-32">
            {cycleHistory.map((val, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(val / 32) * 100}%` }} transition={{ delay: i * 0.05 }} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-secondary group relative cursor-pointer"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100">{val}d</div></motion.div>)}
          </div>
          <div className="mt-3 p-3 rounded-xl bg-cycle-follicular/10 text-sm text-cycle-follicular font-medium">✅ Your cycle is very regular (avg 28 days)</div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <h3 className="font-semibold mb-3">Current Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}</h3>
        <p className="text-sm text-hermaa-muted">Your body is in the {phase} phase. Adjust nutrition, exercise, and rest according to your body&apos;s needs.</p>
      </GlassCard>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center gap-3"><span className="text-xs text-hermaa-muted w-20">{label}</span><div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" /></div><span className="text-xs font-medium text-primary w-8 text-right">{value}%</span></div>;
}

// === Profile ===
function ProfileTab({ userName, onLogout, lang }: { userName: string; onLogout: () => void; lang: string }) {
  const user = getUser();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4"><span className="text-3xl text-white font-bold">{userName.charAt(0).toUpperCase()}</span></div>
        <h2 className="text-2xl font-semibold">{userName}</h2>
        <p className="text-sm text-hermaa-muted">{user?.email}</p>
      </div>
      <GlassCard hover={false}>
        <h3 className="font-semibold mb-4">Account Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-primary/5"><span className="text-sm text-hermaa-muted">Email</span><span className="text-sm font-medium">{user?.email}</span></div>
          <div className="flex justify-between py-2 border-b border-primary/5"><span className="text-sm text-hermaa-muted">Language</span><span className="text-sm font-medium">{user?.language === "hi" ? "Hindi" : "English"}</span></div>
          <div className="flex justify-between py-2"><span className="text-sm text-hermaa-muted">Age</span><span className="text-sm font-medium">{user?.age || "--"}</span></div>
        </div>
      </GlassCard>
      <button onClick={onLogout} className="w-full py-3.5 rounded-2xl border-2 border-cycle-menstrual text-cycle-menstrual font-semibold hover:bg-cycle-menstrual/5 transition-colors">{t("logOut", lang)}</button>
    </div>
  );
}
