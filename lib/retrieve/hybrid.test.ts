import {describe, expect, it} from "vitest";

describe("hybrid retrieval", () => {
  it("filters by firm and deal, then fuses vector and text ranks", async () => {
    const hybridModule = await import("./hybrid").catch(() => null);

    expect(hybridModule).not.toBeNull();
    const results = hybridModule!.hybridRetrieve({
      chunks: [
        {id: "chunk_vector", firm_id: "firm_demo", deal_id: "project_nova", text: "ARR bridge", vector_score: 0.99, text_score: 0.1, metadata: {type: "email"}},
        {id: "chunk_text", firm_id: "firm_demo", deal_id: "project_nova", text: "annual recurring revenue", vector_score: 0.2, text_score: 0.99, metadata: {type: "spreadsheet"}},
        {id: "chunk_other", firm_id: "firm_other", deal_id: "project_nova", text: "leak", vector_score: 1, text_score: 1, metadata: {type: "email"}},
      ],
      firmId: "firm_demo",
      dealId: "project_nova",
      limit: 2,
    });

    expect(results.map((item: {id: string}) => item.id)).toEqual(["chunk_text", "chunk_vector"]);
  });
});
