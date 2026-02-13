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
    
    // Access the key securely from the server
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key missing" }, { status: 500 });
    }

    const systemInstruction = `
      You are Bavi, the AI assistant for ${CLINIC_DATA.name}.
      CONTEXT:
      - Locations: ${CLINIC_DATA.locations}.
      - Emergency Hotline: ${CLINIC_DATA.phone}.
      - PRICING:
        * General Checkup: ${CLINIC_DATA.prices.consultation}
        * Specialist: ${CLINIC_DATA.prices.specialist}
        * Lab Tests: ${CLINIC_DATA.prices.lab}
        * Maternity: ${CLINIC_DATA.prices.maternity}

      RULES:
      1. Keep answers short (max 3 sentences).
      2. If "pain", "bleeding", or "emergency", START with "🚨 URGENT:" and refer to ${CLINIC_DATA.phone}.
      3. Use bolding (Markdown) for prices.
    `;

    // Try Flash Model first (Faster)
    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }]
        })
      }
    );

    let data = await response.json();

    // If Flash fails, try Pro (More compatible)
    if (data.error) {
        console.log("Switching to Pro model...");
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }]
                })
            }
        );
        data = await response.json();
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}