import { callDeepSeek, type DeepSeekMessage } from "@/ai/deepseek";
import { COMPLIANCE_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export type ChatMessage = DeepSeekMessage;

export interface DeepSeekResponse {
  success: boolean;
  content: string;
  error?: string;
}

const SYSTEM_PROMPT = COMPLIANCE_SYSTEM_PROMPT + `

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
  const systemMessage: ChatMessage = {
    role: "system",
    content: context
      ? `${SYSTEM_PROMPT}\n\nRELEVANT CONTEXT:\n${context}\n\nUse the above context to inform your response when applicable. If the context doesn't answer the question, say so and provide general guidance.`
      : SYSTEM_PROMPT,
  };

  try {
    const content = await callDeepSeek({
      messages: [systemMessage, ...messages],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Failed to reach DeepSeek",
    };
  }
}
