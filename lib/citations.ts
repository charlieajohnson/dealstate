import type {ArtefactSegment, SourceCitation} from "./schemas";

type VerificationResult =
  | {ok: true; segment: ArtefactSegment}
  | {ok: false; reason: "missing_segment_id" | "segment_not_found" | "locator_mismatch" | "missing_extracted_text" | "extracted_text_not_found"};

function sameLocator(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function verifyCitation(citation: SourceCitation, segments: ArtefactSegment[]): VerificationResult {
  if (!citation.segment_id) return {ok: false, reason: "missing_segment_id"};

  const segment = segments.find((item) => item.id === citation.segment_id);
  if (!segment) return {ok: false, reason: "segment_not_found"};

  if (citation.locator && !sameLocator(citation.locator, segment.locator)) {
    return {ok: false, reason: "locator_mismatch"};
  }

  if (!citation.extracted_text) return {ok: false, reason: "missing_extracted_text"};
  if (!segment.text.includes(citation.extracted_text)) return {ok: false, reason: "extracted_text_not_found"};

  return {ok: true, segment};
}

export function verifyCitations(citations: SourceCitation[], segments: ArtefactSegment[]): VerificationResult[] {
  return citations.map((citation) => verifyCitation(citation, segments));
}
