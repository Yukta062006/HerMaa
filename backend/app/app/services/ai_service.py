import httpx
from typing import Optional, List
from ..core.config import settings

SYSTEM_PROMPT = """You are HerMaa AI, a caring women's health assistant representing the mother-daughter bond.
Specialties: Menstrual health, PCOS, Pregnancy, Nutrition, Mental health, Exercise, Hormones.
Be empathetic, use emojis, support 9 Indian languages, never diagnose, always recommend doctors for serious concerns.
Keep responses concise but informative. Use bullet points for clarity."""

FALLBACK_RESPONSES = {
    "eat|food|diet|nutrition|period food": "🍎 **Period-Friendly Foods:**\n\n• **Iron-rich:** Spinach, lentils, beetroot, pomegranate\n• **Omega-3:** Flaxseeds, walnuts, fatty fish\n• **Magnesium:** Dark chocolate, bananas, almonds\n• **Vitamin C:** Amla, oranges, guava\n• **Warm foods:** Ginger tea, turmeric milk, soups\n\n❌ Avoid: Excessive caffeine, salty/processed foods\n💧 Stay hydrated — 8-10 glasses daily! 💕",
    "cramp|pain|manage|relief": "💆 **Managing Cramps Naturally:**\n\n1. Heat therapy — warm water bottle on belly\n2. Ginger tea — anti-inflammatory\n3. Gentle yoga — cat-cow, child's pose\n4. Light walking — 15-20 mins\n5. Deep breathing — 4-7-8 technique\n6. Massage — circular motions with warm oil\n\n⚠️ If severe, please consult a doctor. 🌸",
    "pcos|polycystic|irregular": "🩺 **PCOS Awareness:**\n\n**Symptoms:** Irregular periods, excess hair, acne, weight gain, hair thinning\n\n**What helps:** Regular exercise, balanced diet, adequate sleep, stress management\n\n⚠️ Only a doctor can diagnose PCOS. If you notice 2-3 symptoms, schedule a visit. 💜",
    "exercise|workout|yoga|fitness": "🧘 **Exercise by Phase:**\n\n• Menstrual: Gentle walks, restorative yoga\n• Follicular: HIIT, running, strength training\n• Ovulation: Peak energy — go all out!\n• Luteal: Pilates, swimming, cycling\n\nListen to your body! 💪",
    "sleep|insomnia|tired|fatigue": "😴 **Sleep Tips:**\n\n• Consistent schedule\n• No screens 1hr before bed\n• Chamomile tea or warm milk\n• Cool, dark room\n• 4-7-8 breathing\n• Limit caffeine after 2 PM 🌙💕",
    "stress|anxiety|mental|mood": "🧘 **Mental Wellness:**\n\n• Deep breathing (5 min daily)\n• Journal your thoughts\n• Connect with loved ones\n• Nature walks\n• Limit social media\n• It's okay to not be okay 💜",
}


class AIService:
    def __init__(self):
        self.nvidia_key = settings.NVIDIA_API_KEY if len(settings.NVIDIA_API_KEY or "") > 10 else None
        self.gemini_model = None

        # Try Gemini as fallback
        if not self.nvidia_key and settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
            except Exception:
                pass

        self._chats: dict = {}

    def _fallback_response(self, message: str) -> str:
        msg_lower = message.lower()
        for keys, response in FALLBACK_RESPONSES.items():
            if any(k in msg_lower for k in keys.split("|")):
                return response
        return "💕 Hi! I'm HerMaa AI.\n\nI can help with:\n• 🩸 Period & cycle questions\n• 🍎 Nutrition advice\n• 🧘 Exercise tips\n• 🩺 PCOS awareness\n• 😌 Emotional wellbeing\n\nTry: \"What should I eat during my period?\" 💜"

    async def _nvidia_chat(self, message: str, language: str, context: Optional[dict]) -> Optional[str]:
        """Call NVIDIA NIM API (OpenAI-compatible)"""
        if not self.nvidia_key:
            return None

        ctx_parts = []
        if context:
            if context.get("cycle_day"): ctx_parts.append(f"Cycle day: {context['cycle_day']}")
            if context.get("phase"): ctx_parts.append(f"Phase: {context['phase']}")
        if language != "en": ctx_parts.append(f"Respond in {language}")
        ctx_str = f"\n[Context: {'. '.join(ctx_parts)}]\n" if ctx_parts else ""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.nvidia_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "meta/llama-3.1-8b-instruct",
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": f"{ctx_str}{message}"},
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1024,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass
        return None

    async def _gemini_chat(self, user_id: str, message: str, language: str, context: Optional[dict]) -> Optional[str]:
        """Fallback to Gemini"""
        if not self.gemini_model:
            return None
        try:
            if user_id not in self._chats:
                self._chats[user_id] = self.gemini_model.start_chat()
            chat = self._chats[user_id]

            ctx_parts = []
            if context:
                if context.get("cycle_day"): ctx_parts.append(f"Cycle day: {context['cycle_day']}")
                if context.get("phase"): ctx_parts.append(f"Phase: {context['phase']}")
            if language != "en": ctx_parts.append(f"Respond in {language}")
            full_msg = (f"\n[{'. '.join(ctx_parts)}]\n" if ctx_parts else "") + message

            response = chat.send_message(full_msg)
            return response.text
        except Exception:
            return None

    async def chat(self, user_id: str, message: str, language: str = "en", context: Optional[dict] = None) -> dict:
        # Try NVIDIA first
        response = await self._nvidia_chat(message, language, context)

        # Fallback to Gemini
        if not response:
            response = await self._gemini_chat(user_id, message, language, context)

        # Final fallback to pre-built responses
        if not response:
            response = self._fallback_response(message)

        return {"response": response, "suggestions": self._suggestions(message), "language": language}

    def _suggestions(self, msg: str) -> List[str]:
        l = msg.lower()
        if "period" in l or "eat" in l: return ["Foods for cramps?", "Is my cycle normal?", "Exercise tips"]
        if "pcos" in l: return ["PCOS diet?", "Can PCOS be reversed?", "Exercise for PCOS"]
        if "cramp" in l or "pain" in l: return ["Natural remedies?", "When to see doctor?", "Yoga for cramps"]
        return ["Period diet tips", "Manage cramps", "PCOS info"]

    def reset(self, user_id: str):
        self._chats.pop(user_id, None)


ai_service = AIService()
