import { groq } from "./groq.js";

export async function generateChecklist(title, description) {
  const prompt = `
You are a prompt-to-checklist assistant.

Input problem:
TITLE: ${title}
DESCRIPTION: ${description}

Return ONLY JSON:
{
  "items": [
    { "id": "i1", "text": "Concise, testable acceptance criteria", "required": true, "type": "behaviour" }
  ]
}

Rules:
- MUST return valid JSON.
- No backticks, no markdown, no explanations.
- Just the JSON object.
- 3 to 10 items.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Respond ONLY with valid JSON. No other text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    let raw = response.choices[0].message.content.trim();

    // Remove triple backticks if model accidentally added them
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Parse safely
    const parsed = JSON.parse(raw);

    // MUST return array
    return parsed.items;

  } catch (err) {
    console.error("Checklist generation error:", err);
    return null;
  }
}
