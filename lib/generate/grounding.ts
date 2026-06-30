import type {GroundedAnswer} from "../schemas";

type SegmentRef = {id: string; text: string};

export function validateGroundedAnswer(
  answer: GroundedAnswer,
  segments: SegmentRef[],
):
  | {ok: true; answer: GroundedAnswer}
  | {ok: false; abstained: true; message: "insufficient evidence in the current sources"; answer: GroundedAnswer} {
  const segmentIds = new Set(segments.map((segment) => segment.id));
  const allClaimsSupported = answer.claims.every(
    (claim) => claim.supported && claim.citation_ids.length > 0 && claim.citation_ids.every((id) => segmentIds.has(id)),
  );

  if (answer.abstained || !allClaimsSupported) {
    return {
      ok: false,
      abstained: true,
      message: "insufficient evidence in the current sources",
      answer: {...answer, abstained: true, claims: answer.claims.map((claim) => ({...claim, supported: false}))},
    };
  }

  return {ok: true, answer};
}
