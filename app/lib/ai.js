// Abstração multi-provider: Gemini 2.5 Flash (padrão) ou Anthropic Claude

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

function getProvider() {
  return process.env.AI_PROVIDER || "gemini";
}

// ── Gemini ──────────────────────────────────────────────────────────────────
async function callGemini({ systemPrompt, textContent, imageBase64, imageMimeType, apiKey, maxTokens = 4000 }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const parts = [];
  if (imageBase64 && imageMimeType) {
    parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
  }
  parts.push({ text: textContent });

  const body = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText}`);
  }

function sanitizeJSONString(str) {
  let inString = false;
  let isEscaped = false;
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '"' && !isEscaped) {
      inString = !inString;
      newStr += c;
    } else if (c === '\\') {
      isEscaped = !isEscaped;
      newStr += c;
    } else {
      isEscaped = false;
      if (inString) {
        if (c === '\n') newStr += '\\n';
        else if (c === '\r') newStr += '\\r';
        else if (c === '\t') newStr += '\\t';
        else newStr += c;
      } else {
        newStr += c;
      }
    }
  }
  return newStr;
}

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    const cleaned = text.replace(/```(?:json)?/gi, "").trim();
    const sanitized = sanitizeJSONString(cleaned);
    return JSON.parse(sanitized);
  } catch (err) {
    console.error("Gemini Parse Error. Raw text:", text);
    throw new Error("Resposta inválida da IA — JSON mal formado");
  }
}

// ── Anthropic ────────────────────────────────────────────────────────────────
async function callAnthropic({ systemPrompt, textContent, imageBase64, imageMimeType, apiKey, maxTokens = 4000 }) {
  const content = [];
  if (imageBase64 && imageMimeType) {
    content.push({ type: "image", source: { type: "base64", media_type: imageMimeType, data: imageBase64 } });
  }
  content.push({ type: "text", text: textContent });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || "{}";

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Resposta inválida da IA — JSON mal formado");
  }
}

// ── Interface pública ────────────────────────────────────────────────────────
export async function callAI(options) {
  const provider = getProvider();

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurada no servidor");
    return callAnthropic({ ...options, apiKey });
  }

  // Gemini por padrão
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no servidor");
  return callGemini({ ...options, apiKey });
}

export function getProviderInfo() {
  const provider = getProvider();
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

  if (provider === "anthropic" && hasAnthropic) return { provider: "anthropic", model: ANTHROPIC_MODEL, ok: true };
  if (hasGemini) return { provider: "gemini", model: GEMINI_MODEL, ok: true };
  if (hasAnthropic) return { provider: "anthropic", model: ANTHROPIC_MODEL, ok: true };
  return { provider: null, model: null, ok: false };
}
