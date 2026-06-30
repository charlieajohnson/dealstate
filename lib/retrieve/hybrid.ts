type RetrievalInputChunk = {
  id: string;
  firm_id: string;
  deal_id: string;
  text: string;
  vector_score: number;
  text_score: number;
  metadata: Record<string, string>;
};

type HybridRetrieveInput = {
  chunks: RetrievalInputChunk[];
  firmId: string;
  dealId: string;
  limit: number;
};

function rankBy(chunks: RetrievalInputChunk[], key: "vector_score" | "text_score"): Map<string, number> {
  return new Map(
    [...chunks]
      .sort((a, b) => b[key] - a[key] || a.id.localeCompare(b.id))
      .map((chunk, index) => [chunk.id, index + 1]),
  );
}

export function hybridRetrieve(input: HybridRetrieveInput): (RetrievalInputChunk & {score: number})[] {
  const filtered = input.chunks.filter((chunk) => chunk.firm_id === input.firmId && chunk.deal_id === input.dealId);
  const vectorRanks = rankBy(filtered, "vector_score");
  const textRanks = rankBy(filtered, "text_score");
  const k = 60;

  return filtered
    .map((chunk) => ({
      ...chunk,
      score: 1 / (k + (vectorRanks.get(chunk.id) ?? k)) + 1 / (k + (textRanks.get(chunk.id) ?? k)),
    }))
    .sort((a, b) => b.score - a.score || b.text_score - a.text_score || a.id.localeCompare(b.id))
    .slice(0, input.limit);
}
