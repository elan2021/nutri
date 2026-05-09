import { callAI } from "@/app/lib/ai";

const SYSTEM_PROMPT = `Você é uma IA de apoio nutricional clínico especializada. Gere uma avaliação pré-diagnóstica detalhada em português brasileiro.

Retorne APENAS JSON válido com exatamente estes campos:
{
  "tmb": número (kcal - Taxa Metabólica Basal pela fórmula Harris-Benedict revisada),
  "get": número (kcal - Gasto Energético Total = TMB × fator de atividade),
  "imc": número (kg/m² com 1 casa decimal),
  "classificacaoImc": string (ex: "Obesidade Grau II"),
  "proteinas_g": número (gramas/dia recomendados),
  "carboidratos_g": número (gramas/dia recomendados),
  "gorduras_g": número (gramas/dia recomendados),
  "condutaNutricional": string (parágrafo detalhado com justificativa clínica, mínimo 3 frases),
  "alertasClinicos": array de strings (cada item é um alerta específico, incluir interações medicamentosas relevantes),
  "planoAlimentarInicial": string (sugestão de distribuição em refeições, use quebras de linha com \\n),
  "listaSubstituicao": array de objetos (cada objeto com "alimento" como string e "equivalentes" como array de strings),
  "observacoesGerais": string (considerações adicionais sobre o caso)
}

Regras:
- Calcule TMB com Harris-Benedict revisada (Mifflin-St Jeor): homens = 10×peso + 6.25×altura - 5×idade + 5; mulheres = 10×peso + 6.25×altura - 5×idade - 161
- Multiplique pelo fator de atividade correto
- Considere diagnósticos e medicamentos para ajustar as recomendações
- alertasClinicos deve ter pelo menos 2 itens relevantes ao caso
- IMPORTANTE: NÃO use quebras de linha literais dentro das strings do JSON. Se precisar pular linha (ex: no planoAlimentarInicial), use estritamente os caracteres "\\n" escapados.
- Sem markdown, sem texto fora do JSON`;

export async function POST(req) {
  try {
    const { patient } = await req.json();

    if (!patient) {
      return Response.json({ error: "Campo 'patient' é obrigatório" }, { status: 400 });
    }

    const diagnosis = await callAI({
      systemPrompt: SYSTEM_PROMPT,
      textContent: `Dados do paciente: ${JSON.stringify(patient, null, 2)}`,
      maxTokens: 4000,
    });

    return Response.json({ diagnosis });
  } catch (err) {
    console.error("[/api/diagnose]", err);
    return Response.json(
      { error: "Erro ao gerar diagnóstico", details: String(err.message) },
      { status: 500 }
    );
  }
}
