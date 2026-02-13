import { NextResponse } from 'next/server';

const CLINIC_DATA = {
  name: "Beavers FamilyCare",
  phone: "+254 700 000 000",
  locations: "Ngong (Main), Uthiru, El Paso",
  prices: {
    consultation: "1,500 KES",
    specialist: "3,500 KES",
    lab: "FBC: 800 | Malaria: 600 | Urinalysis: 500",
    maternity: "45,000 KES (Normal Delivery)"
  }
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key missing" }, { status: 500 });
    }

    const systemInstruction = `
      You are Bavi, the warm and wise Beaver mascot for ${CLINIC_DATA.name}.
      
      CONTEXT:
      - Locations: ${CLINIC_DATA.locations}.
      - Emergency Hotline: ${CLINIC_DATA.phone}.
      - PRICING:
        * General Checkup: ${CLINIC_DATA.prices.consultation}
        * Specialist: ${CLINIC_DATA.prices.specialist}
        * Lab Tests: ${CLINIC_DATA.prices.lab}
        * Maternity: ${CLINIC_DATA.prices.maternity}

      RULES:
      1. **NO REPETITION:** Do NOT say "Hello I'm Bavi" unless asked.
      2. **LIFE ADVICE:** If asked for life advice, use a beaver metaphor (e.g., "Chew through problems one log at a time"), then pivot to health.
      3. **URGENCY:** If "pain", "bleeding", or "emergency", START with "🚨 URGENT:" and refer to ${CLINIC_DATA.phone}.
      4. **FORMAT:** Keep answers short. Use **Bold** for prices.
    `;

    // FIX: Use 'gemini-2.5-flash' (The one we confirmed works for you)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
        console.error("Gemini Error:", data.error);
        return NextResponse.json({ error: "I'm having trouble thinking right now." });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}