import { getProviderInfo } from "@/app/lib/ai";

export async function GET() {
  const info = getProviderInfo();
  return Response.json(info, { status: info.ok ? 200 : 503 });
}
