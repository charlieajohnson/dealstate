import {describe,expect,it} from "vitest";import {answerPrompt} from "./mock-chat";
const responses=[{prompt:"What changed since I last looked?",response:"ARR changed.",citations:["doc_1"],confidence:"high" as const,kind:"fact" as const}];
describe("mock opportunity manager",()=>{it("returns exact source-cited seeded answers",()=>expect(answerPrompt("What changed since I last looked?",[...responses]).citations).toEqual(["doc_1"]));it("degrades gracefully outside the demo",()=>expect(answerPrompt("Predict the share price",[...responses]).supported).toBe(false))});
