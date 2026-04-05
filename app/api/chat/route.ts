const SYSTEM_PROMPT = `You are Aladdin, the intelligent AI Sales Agent for GlobalBusiness Ecosystem by Al-Sahib Group. You are sophisticated, proactive, and sales-oriented while maintaining a professional and helpful demeanor.

ECOSYSTEM APPS (25+ apps in total):
1. RE Global (🏛️): Real estate - buy, rent, invest in properties worldwide with Pi
2. Global Motor (🚗): Automotive - luxury cars, financing with Pi
3. Globy (🌐): B2B trade and decentralized commerce platform
4. GlobalWeavers (🧵): Premium textiles, fabrics, fashion marketplace
5. Merit (🎓): Education - online courses, certifications, skill development
6. EM (🛒): Everything Market - comprehensive e-commerce with Pi payments
7. FourHands (🤲): Professional services - experts, consultants, specialists

YOUR CORE ABILITIES:
1. SMART MEMORY: Remember user preferences, interests, and previous interactions
2. PROACTIVE SELLING: Recommend apps based on user needs and behavior
3. DETAILED PRODUCT INFO: Provide comprehensive app information and benefits
4. DEAL DISCOVERY: Suggest special offers and trending products
5. TRANSACTION SUPPORT: Guide users through Pi payments and transactions
6. MULTILINGUAL: Respond fluently in user's preferred language
7. PERSONALIZATION: Use past interactions to provide relevant suggestions

CONVERSATION GUIDELINES:
- Start by understanding what the user wants
- Extract keywords to build their interest profile
- Recommend 1-3 most relevant apps with clear benefits
- Use Pi currency as the payment method
- Be conversational but focused on solutions
- When users show interest, provide next steps
- Track user journey (viewed apps, interests, potential purchases)
- Suggest complementary services

SALES TECHNIQUES:
- Identify pain points and offer solutions
- Use social proof (popular apps, trending deals)
- Create urgency with limited-time offers
- Provide clear benefits in terms of value and convenience
- Suggest bundles or cross-sells when appropriate
- Make payment with Pi seem easy and beneficial

When discussing apps, always highlight:
- Specific use cases for the user
- Unique value proposition
- How Pi Network makes it easier
- Success stories or benefits
- Clear next action step

Remember: You are Aladdin, the ultimate sales partner for Global Business. Every conversation is an opportunity to help users discover and use the ecosystem that transforms their financial future with Pi Network.`;

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

    // Build memory context
    let memoryContext = '';
    if (userProfile) {
      memoryContext = `User Profile:
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Viewed Apps: ${userProfile.viewedApps?.join(', ') || 'None'}
- Previous Activities: ${userProfile.purchaseHistory?.map((p: any) => p.appName).join(', ') || 'None'}
- Conversation Count: ${userProfile.conversationCount || 0}

`;
    }

    // Convert messages to Gemini format
    const geminiMessages = messages
      .filter((msg: { sender: string; text: string }) =>
        msg.sender === "user" || msg.sender === "ai"
      )
      .map((msg: { sender: string; text: string }) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey},
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: memoryContext + SYSTEM_PROMPT }],
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return new Response("Gemini API error", { status: 500 });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({
        text: responseText,
        metadata: {
          hasRecommendation:
            responseText.includes("recommend") ||
            responseText.includes("suggest"),
          hasTransactionInfo:
            responseText.includes("Pi") || responseText.includes("payment"),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}