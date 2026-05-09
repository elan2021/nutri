import "./globals.css";

export const metadata = {
  title: "NutriAI — Avaliação Nutricional Inteligente",
  description:
    "Ferramenta de apoio nutricional clínico com IA. Faça upload de encaminhamentos, confirme os dados e gere pré-diagnósticos completos em segundos.",
  openGraph: {
    title: "NutriAI — Avaliação Nutricional Inteligente",
    description: "Pré-diagnóstico nutricional com IA em segundos.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
