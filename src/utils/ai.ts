// src/utils/ai.ts

export async function askAI(prompt: string, notes: string[]): Promise<string> {
  const fullContext = notes.map((note, i) => `Note ${i + 1}: ${note}`).join("\n\n")

  const systemPrompt = `
You are BrainPocket’s smart assistant. Help the user by interpreting their natural language queries and respond conversationally using their saved notes. You can:

- Summarize recent or all notes
- Extract important information or tags
- Search semantically, even if exact words don't match
- Expand on brief notes with deeper insight or examples
- Answer time-based queries like "this week" or "last month"

Here are the user's notes:
${fullContext}

User query: "${prompt}"

Respond clearly and naturally. Do not repeat the notes verbatim unless asked. Focus on what’s relevant to the query.
`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4", // or "gpt-3.5-turbo" if usage/cost is a concern
      messages: [
        { role: "system", content: systemPrompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  const data = await response.json();

  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  } else {
    console.error("AI API error:", data);
    return "Sorry, I couldn't find anything useful based on your request.";
  }
}


