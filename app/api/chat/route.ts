export async function POST(request: Request) {
  try {
    const { messages, userProfile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response("API key not configured", { status: 500 });
    }

    let memoryContext = "";
    if (userProfile) {
      memoryContext = "User Interests: " + (userProfile.interests?.join(", ") || "Not specified") + "\n";
    }

    const systemPrompt = "You are Aladdin, the intelligent AI Sales Agent for GlobalBusiness Ecosystem by Al-Sahib Group. You help users discover apps in the ecosystem including RE Global for real estate, Global Motor for cars, Globy for B2B trade, and more. Always respond helpfully and recommend relevant apps. Support multiple languages.";

    const geminiMessages = messages
      .filter((msg: any) => msg.sender === "user" || msg.sender === "ai")
      .map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: memoryContext + systemPrompt }],
        },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({ text: responseText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}