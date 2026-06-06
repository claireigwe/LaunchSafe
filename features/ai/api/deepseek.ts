const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekResponse {
  success: boolean;
  content: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are a compliance assistant for LaunchSafe, a compliance intelligence platform for African businesses.

RULES:
- NEVER invent regulations, compliance obligations, agencies, deadlines, costs, or penalties.
- NEVER present assumptions as facts.
- When information cannot be verified, clearly state: "I cannot verify this information. Please check with the relevant regulatory agency."
- Always prefer information from the provided context over your training data.
- If the user asks about specific costs, deadlines, or requirements, always include: "Verify this with the relevant agency before acting."
- Keep responses concise and actionable.
- Do not act as a legal advisor. Recommend users consult professionals for legal advice.
- Structure responses with clear sections when helpful.

YOUR CAPABILITIES:
- Explain compliance requirements in plain language
- Summarize regulatory updates
- Draft compliance documents for review
- Answer questions about compliance processes
- Identify relevant regulatory agencies`;

export async function chatWithDeepSeek(
  messages: ChatMessage[],
  context?: string
): Promise<DeepSeekResponse> {
  if (!DEEPSEEK_API_KEY) {
    return {
      success: false,
      content: "",
      error: "DeepSeek API key not configured",
    };
  }

  const systemMessage: ChatMessage = {
    role: "system",
    content: context
      ? `${SYSTEM_PROMPT}\n\nRELEVANT CONTEXT:\n${context}\n\nUse the above context to inform your response when applicable. If the context doesn't answer the question, say so and provide general guidance.`
      : SYSTEM_PROMPT,
  };

  try {
    const res = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [systemMessage, ...messages],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        content: "",
        error: data.error?.message || "DeepSeek API error",
      };
    }

    return {
      success: true,
      content: data.choices[0].message.content,
    };
  } catch (error) {
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Failed to reach DeepSeek",
    };
  }
}
