import {verifyCitation} from "../citations";
import {Fact} from "../schemas";
import type {ArtefactSegment, ExtractionCandidate, Fact as FactType} from "../schemas";

type RejectedCandidate = {
  candidate_id: string;
  reason: string;
};

function conflictsFor(fact: FactType, existingFacts: FactType[], newFacts: FactType[]): string[] {
  return [...existingFacts, ...newFacts]
    .filter((other) => other.opportunity_id === fact.opportunity_id && other.key === fact.key && other.value !== fact.value)
    .map((other) => other.id);
}

export function materialiseExtractionCandidates(input: {
  candidates: ExtractionCandidate[];
  segments: ArtefactSegment[];
  existingFacts: FactType[];
}): {facts: FactType[]; rejected: RejectedCandidate[]} {
  const facts: FactType[] = [];
  const rejected: RejectedCandidate[] = [];

  for (const candidate of input.candidates) {
    if (candidate.candidate_type !== "fact") continue;

    const verification = candidate.citations.map((citation) => verifyCitation(citation, input.segments));
    const failure = verification.find((result) => !result.ok);
    if (failure && !failure.ok) {
      rejected.push({candidate_id: candidate.id, reason: failure.reason});
      continue;
    }

    const parsed = Fact.safeParse({
      ...candidate.payload,
      citations: candidate.citations,
      conflicts_with: [],
    });
    if (!parsed.success) {
      rejected.push({candidate_id: candidate.id, reason: "schema_validation_failed"});
      continue;
    }

    const fact = parsed.data;
    fact.conflicts_with = conflictsFor(fact, input.existingFacts, facts);
    facts.push(fact);
  }

  return {facts, rejected};
}
