import { callAI } from "@/app/lib/ai";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/heic"];

const SYSTEM_PROMPT = `Você é um extrator de dados clínicos de documentos médicos. Analise a imagem e extraia os dados disponíveis.

Retorne APENAS JSON válido com exatamente estes campos (use null para dados ausentes):
{
  "nome": string ou null,
  "idade": número ou null,
  "sexo": "Masculino" ou "Feminino" ou null,
  "peso": número (kg) ou null,
  "altura": número (cm) ou null,
  "diagnostico": string ou null,
  "medicamentos": string ou null,
  "encaminhamento": string ou null,
  "observacoes": string ou null
}

Sem markdown, sem texto fora do JSON.`;

export async function POST(req) {
  try {
    const { base64, mimeType } = await req.json();

    if (!base64 || !mimeType) {
      return Response.json({ error: "Campos 'base64' e 'mimeType' são obrigatórios" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return Response.json(
        { error: `Tipo de arquivo não suportado: ${mimeType}. Use JPG, PNG ou WEBP.` },
        { status: 415 }
      );
    }

    // Limite de ~8MB de base64 (≈ 6MB de imagem)
    if (base64.length > 8_000_000) {
      return Response.json({ error: "Imagem muito grande. Limite: 6MB." }, { status: 413 });
    }

    const extracted = await callAI({
      systemPrompt: SYSTEM_PROMPT,
      textContent: "Extraia os dados clínicos desta imagem.",
      imageBase64: base64,
      imageMimeType: mimeType,
      maxTokens: 1000,
    });

    // Limpar nulos
    const clean = Object.fromEntries(
      Object.entries(extracted).filter(([, v]) => v !== null && v !== undefined && v !== "")
    );

    return Response.json({ extracted: clean });
  } catch (err) {
    console.error("[/api/extract]", err);
    return Response.json(
      { error: "Erro ao extrair dados da imagem", details: String(err.message) },
      { status: 500 }
    );
  }
}
