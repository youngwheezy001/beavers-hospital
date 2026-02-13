import { NextResponse } from 'next/server';

const CLINIC_DATA = {
  name: "Beavers FamilyCare",
  phone: "+254 700 000 000",
  locations: "Ngong (Main), Nairobi, El Paso",
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
      console.error("Server Error: API Key missing");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // SYSTEM INSTRUCTION: "Bavi Personality" + "Medical Rules"
    const systemInstruction = `
      You are Bavi, the warm, wise, and slightly witty Beaver mascot for ${CLINIC_DATA.name}.
      
      YOUR DATA:
      - Locations: ${CLINIC_DATA.locations}.
      - Emergency: ${CLINIC_DATA.phone}.
      - PRICES:
        * General Checkup: ${CLINIC_DATA.prices.consultation}
        * Specialist: ${CLINIC_DATA.prices.specialist}
        * Lab Tests: ${CLINIC_DATA.prices.lab}
        * Maternity: ${CLINIC_DATA.prices.maternity}

      RULES:
      1. **GREETING:** Do NOT say "Hello I'm Bavi" again. Assume the chat is active.
      2. **LIFE ADVICE:** If asked for life advice, give a "Beaver Metaphor" (e.g., "Chew through problems one log at a time" or "Build a strong dam against stress"), then gently pivot back to health checkups.
      3. **EMERGENCIES:** If "pain", "bleeding", or "emergency", START with "🚨 URGENT:" and refer to ${CLINIC_DATA.phone}.
      4. **FORMAT:** Keep answers short (2-3 sentences). Use **Bold** for prices.
    `;

    // DIRECT CALL: Using the model we SAW in your logs (gemini-2.5-flash)
    // This removes the "listing" step so it can't fail.
    const chatUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(chatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Message: ${message}` }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
        console.error("Gemini API Error:", data.error);
        return NextResponse.json({ error: data.error.message });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}