import google.generativeai as genai
from typing import Optional, List
from ..core.config import settings

SYSTEM_PROMPT = """You are HerMaa AI, a caring women's health assistant representing the mother-daughter bond.
Specialties: Menstrual health, PCOS, Pregnancy, Nutrition, Mental health, Exercise, Hormones.
Be empathetic, use emojis, support 9 Indian languages, never diagnose, always recommend doctors for serious concerns."""

# Fallback responses when Gemini is unavailable
FALLBACK_RESPONSES = {
    "eat|food|diet|nutrition|period food": "🍎 **Period-Friendly Foods:**\n\n• **Iron-rich:** Spinach, lentils (dal), beetroot, pomegranate\n• **Omega-3:** Flaxseeds, walnuts, fatty fish\n• **Magnesium:** Dark chocolate, bananas, almonds\n• **Vitamin C:** Amla, oranges, guava (helps absorb iron)\n• **Warm foods:** Ginger tea, turmeric milk, soups\n\n❌ **Avoid:** Excessive caffeine, very salty/processed foods, cold drinks\n\n💧 Stay hydrated — drink 8-10 glasses of water daily!\n\nRemember, every body is different. Listen to yours. 💕",
    "cramp|pain|manage|relief": "💆 **Managing Period Cramps Naturally:**\n\n1. **Heat therapy** — Place a warm water bottle on your lower belly\n2. **Ginger tea** — Boil fresh ginger, add honey. Anti-inflammatory!\n3. **Gentle yoga** — Cat-cow pose, child's pose, butterfly stretch\n4. **Light walking** — 15-20 mins increases blood flow\n5. **Deep breathing** — 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)\n6. **Massage** — Circular motions with warm oil on lower abdomen\n7. **Hydration** — Warm water reduces bloating\n\n⚠️ If pain is severe or disrupts daily life, please consult a doctor.\n\nYou're doing great! 🌸",
    "pcos|polycystic|irregular": "🩺 **PCOS Awareness:**\n\n**Common Symptoms:**\n• Irregular periods (>35 days apart)\n• Heavy or prolonged bleeding\n• Excess facial/body hair growth\n• Persistent acne & oily skin\n• Weight gain around the belly\n• Hair thinning on scalp\n• Dark skin patches (neck, armpits)\n\n**What helps:**\n• Regular exercise (30 min/day)\n• Balanced diet (low GI foods)\n• Adequate sleep (7-8 hours)\n• Stress management\n• Regular check-ups\n\n⚠️ **Important:** Only a doctor can diagnose PCOS through blood tests and ultrasound. If you notice 2-3 symptoms, please schedule a visit.\n\nYou're not alone — 1 in 5 Indian women has PCOS. 💜",
    "exercise|workout|yoga|fitness": "🧘 **Exercise Guide by Cycle Phase:**\n\n**Menstrual (Days 1-5):**\n• Gentle walks, restorative yoga\n• Light stretching\n• Rest if needed — that's okay!\n\n**Follicular (Days 6-13):**\n• High-intensity workouts\n• Running, dancing, strength training\n• Try something new!\n\n**Ovulation (Days 14-16):**\n• Peak energy — go all out!\n• HIIT, spinning, group sports\n\n**Luteal (Days 17-28):**\n• Moderate cardio, pilates\n• Swimming, cycling\n• Prioritize sleep & recovery\n\n**Benefits:** Reduces cramps, boosts mood, improves sleep, balances hormones 💪\n\nListen to your body — some days rest IS the workout. 🌙",
    "sleep|insomnia|tired|fatigue": "😴 **Sleep Tips for Better Health:**\n\n• Maintain consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Try chamomile or warm milk\n• Keep room cool and dark\n• Practice 4-7-8 breathing\n• Gentle stretching before bed\n• Limit caffeine after 2 PM\n\nDuring luteal phase, you may need extra rest — that's completely normal! 🌙💕",
    "stress|anxiety|mental|mood": "🧘 **Mental Wellness Tips:**\n\n• Practice deep breathing (5 minutes daily)\n• Journal your thoughts and feelings\n• Connect with friends or family\n• Take a nature walk\n• Try meditation apps\n• Limit social media time\n• Remember: It's okay to not be okay\n\nHormonal changes affect mood — especially before periods. Be gentle with yourself. 💜\n\nIf feelings persist, talking to a counselor can help. There's no shame in seeking support.",
    "pregnancy|pregnant|conceive": "🤱 **Pregnancy & Conception Basics:**\n\n• Ovulation typically occurs around day 14 of a 28-day cycle\n• Fertile window: 5 days before + day of ovulation\n• Track basal body temperature for accuracy\n• Folic acid supplements recommended before conception\n• Healthy weight & balanced diet improve chances\n\n⚠️ For personalized advice, please consult your gynecologist.\n\nWishing you all the best on your journey! 💕",
    "hygiene|pad|tampon|cup": "🌸 **Period Hygiene Tips:**\n\n• Change pad/tampon every 4-6 hours\n• Wash intimate area with plain water\n• Wear breathable cotton underwear\n• Menstrual cups are safe & eco-friendly\n• Always wash hands before & after changing\n• Dispose of pads properly (wrap & bin)\n\nYour comfort and health matter. Choose what works best for YOU. 💜",
}


class AIService:
    def __init__(self):
        self.model = None
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
            except Exception:
                self.model = None
        self._chats = {}

    def _get_chat(self, user_id: str):
        if user_id not in self._chats:
            self._chats[user_id] = self.model.start_chat() if self.model else None
        return self._chats[user_id]

    def _fallback_response(self, message: str) -> str:
        msg_lower = message.lower()
        for keys, response in FALLBACK_RESPONSES.items():
            if any(k in msg_lower for k in keys.split("|")):
                return response
        return "💕 Hi! I'm HerMaa AI, your caring health companion.\n\nI can help with:\n• 🩸 Period & cycle questions\n• 🍎 Diet & nutrition advice\n• 🧘 Exercise recommendations\n• 🩺 PCOS awareness\n• 😌 Emotional wellbeing\n• 🤱 Pregnancy basics\n• 🌸 Hygiene tips\n\nTry asking: \"What should I eat during my period?\" or \"How to manage cramps?\"\n\n*Note: I provide general wellness guidance. For medical concerns, please consult a healthcare professional.* 💜"

    async def chat(self, user_id: str, message: str, language: str = "en", context: Optional[dict] = None) -> dict:
        # Try Gemini first
        if self.model:
            try:
                chat = self._get_chat(user_id)
                if chat:
                    ctx_parts = []
                    if context:
                        if context.get("cycle_day"): ctx_parts.append(f"Cycle day: {context['cycle_day']}")
                        if context.get("phase"): ctx_parts.append(f"Phase: {context['phase']}")
                        if context.get("symptoms"): ctx_parts.append(f"Symptoms: {', '.join(context['symptoms'])}")
                    if language != "en": ctx_parts.append(f"Respond in {language}")
                    full_msg = (f"\n[{'. '.join(ctx_parts)}]\n" if ctx_parts else "") + message
                    response = chat.send_message(full_msg)
                    return {"response": response.text, "suggestions": self._suggestions(message), "language": language}
            except Exception:
                pass

        # Fallback to pre-built responses
        return {"response": self._fallback_response(message), "suggestions": self._suggestions(message), "language": language}

    def _suggestions(self, msg: str) -> List[str]:
        l = msg.lower()
        if "period" in l or "eat" in l or "food" in l: return ["Foods for period pain?", "Is my cycle normal?", "Exercise tips for periods"]
        if "pcos" in l: return ["PCOS diet tips?", "Can PCOS be reversed?", "Exercise for PCOS"]
        if "cramp" in l or "pain" in l: return ["Natural remedies?", "When to see a doctor?", "Yoga for cramps"]
        if "exercise" in l or "workout" in l: return ["Best phase for HIIT?", "Yoga during periods?", "How much is too much?"]
        return ["Period diet tips", "Manage cramps naturally", "PCOS symptoms explained"]

    def reset(self, user_id: str):
        self._chats.pop(user_id, None)


ai_service = AIService()
