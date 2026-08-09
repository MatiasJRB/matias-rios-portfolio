import {
  generateLlmsTxt,
  LLMS_TEXT_HEADERS,
} from "@/lib/llms";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const body = await generateLlmsTxt();

  return new Response(body, {
    headers: LLMS_TEXT_HEADERS,
  });
}
