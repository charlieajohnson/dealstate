import fs from "node:fs";
import path from "node:path";

export type PromptDefinition = {
  id: string;
  version: string;
  text: string;
};

export type PromptRegistry = {
  get(id: string, version: string): PromptDefinition;
  list(): PromptDefinition[];
};

function parsePromptFilename(filename: string): Pick<PromptDefinition, "id" | "version"> | null {
  const match = /^(?<id>.+)@(?<version>\d+\.\d+\.\d+)\.md$/.exec(filename);
  if (!match?.groups) return null;
  return {id: match.groups.id!, version: match.groups.version!};
}

export function createPromptRegistry(directory = path.join(process.cwd(), "lib", "prompts")): PromptRegistry {
  const prompts = new Map<string, PromptDefinition>();

  for (const filename of fs.readdirSync(directory)) {
    const parsed = parsePromptFilename(filename);
    if (!parsed) continue;
    const prompt = {
      ...parsed,
      text: fs.readFileSync(path.join(directory, filename), "utf8").trim(),
    };
    prompts.set(`${prompt.id}@${prompt.version}`, prompt);
  }

  return {
    get(id, version) {
      const prompt = prompts.get(`${id}@${version}`);
      if (!prompt) throw new Error(`Unknown prompt ${id}@${version}`);
      return prompt;
    },
    list() {
      return [...prompts.values()];
    },
  };
}
