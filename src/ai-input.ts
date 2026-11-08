export type AiChatInput = {
  prompt: string;
  userRole: string;
  organizationName: string;
};

export function parseAiChatInput(body: unknown): AiChatInput | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  if (typeof record.prompt !== "string") return null;
  const prompt = record.prompt.trim();
  if (!prompt || prompt.length > 2_000) return null;
  if (record.userRole !== undefined && (typeof record.userRole !== "string" || record.userRole.length > 64)) return null;
  if (record.organizationName !== undefined && (typeof record.organizationName !== "string" || record.organizationName.length > 120)) return null;
  if (record.userRole !== undefined && !['STUDENT', 'CANDIDATE', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN'].includes(record.userRole as string)) return null;
  return {
    prompt,
    userRole: typeof record.userRole === "string" ? record.userRole.trim() : "STUDENT",
    organizationName: typeof record.organizationName === "string" ? record.organizationName.trim() : "SmartVote Enterprise",
  };
}
