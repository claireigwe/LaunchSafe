export type DeepSeekMessage = { role: "system" | "user" | "assistant"; content: string };

interface CallDeepSeekOptions {
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  signal?: AbortSignal;
}

export async function callDeepSeek(options: CallDeepSeekOptions): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not defined");
  }

  const controller = options.signal ? undefined : new AbortController();
  const timeoutId = controller ? setTimeout(() => controller.abort(), 45000) : undefined;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.max_tokens ?? 2000,
      }),
      signal: options.signal ?? controller?.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error("DeepSeek API request timed out after 45 seconds.");
    }
    throw err;
  }
}
