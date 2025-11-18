import { groq } from "./groq.js";

export async function evaluateSolution(checklistItems, explanation, code) {
  const prompt = `
You are an AI evaluator. You receive:
1. A list of acceptance criteria (checklist items).
2. A freelancer's solution explanation.
3. The submitted code.

You MUST return STRICT JSON ONLY in this format:

{
  "score": number, 
  "per_item": [
    { "item_id": "i1", "passed": true, "comment": "..." }
  ],
  "missing_items": ["i2", "i3"],
  "recommendations": ["..."]
}

Rules:
- Score must be 0–100.
- Check EACH item from the checklist.
- "passed" must be true or false only.
- Do NOT add any extra fields.
- Do NOT include markdown, no backticks.
- Keep comments short.
- Base score mainly on how many required items pass.
- If anything unclear, mark passed=false.
  
CHECKLIST ITEMS:
${JSON.stringify(checklistItems, null, 2)}

EXPLANATION:
${explanation}

CODE:
${code}
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      messages: [
        { role: "system", content: "Return ONLY valid JSON. NOTHING else." },
        { role: "user", content: prompt }
      ]
    });

    let raw = response.choices[0].message.content.trim();

    // strip fences in case model tries to use ```json
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const json = JSON.parse(raw);
    return json;

  } catch (error) {
    console.error("AI evaluation error:", error);
    return null;
  }
}
