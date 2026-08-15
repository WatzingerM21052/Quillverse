/**
 * Defense in depth for generateStory() responses: forced-JSON API modes
 * (Gemini responseMimeType, OpenAI response_format) already return clean
 * JSON, but not every provider has that (Anthropic's Messages API doesn't),
 * so a model can still wrap its answer in a markdown code fence or a
 * sentence of prose despite the prompt asking it not to. Strips that before
 * the text reaches validateManualTurnResponse()'s strict JSON.parse.
 */
export function stripToJsonObject(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? raw;

  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return candidate.trim();

  return candidate.slice(start, end + 1).trim();
}
