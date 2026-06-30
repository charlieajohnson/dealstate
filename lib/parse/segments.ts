import type {ArtefactSegment, RawArtefact, SourceLocator} from "../schemas";

function segmentId(rawArtefactId: string, ordinal: number): string {
  return `seg_${rawArtefactId}_${String(ordinal).padStart(4, "0")}`;
}

function sourceId(raw: RawArtefact): string {
  return raw.external_id;
}

function nonEmptyLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseEmailBody(text: string): string {
  const parts = text.split(/\r?\n\r?\n/);
  return (parts.at(-1) ?? text).trim();
}

function parseCsv(raw: RawArtefact, content: string): ArtefactSegment[] {
  const [headerLine, ...rows] = nonEmptyLines(content);
  const headers = (headerLine ?? "").split(",").map((item) => item.trim());

  return rows.map((row, index) => {
    const values = row.split(",").map((item) => item.trim());
    const text = headers.map((header, valueIndex) => `${header}=${values[valueIndex] ?? ""}`).join(" ");
    return {
      id: segmentId(raw.id, index + 1),
      raw_artefact_id: raw.id,
      source_id: sourceId(raw),
      locator: {kind: "csv", row: index + 1, columns: headers} satisfies SourceLocator,
      text,
      ordinal: index + 1,
    };
  });
}

function parseSpreadsheetText(raw: RawArtefact, content: string): ArtefactSegment[] {
  return nonEmptyLines(content)
    .filter((line) => line.includes(","))
    .map((line, index) => {
      const [cell = `A${index + 1}`, text = line] = line.split(",", 2);
      const [sheet = "Sheet1", range = cell] = cell.includes("!") ? cell.split("!", 2) : ["Sheet1", cell];
      return {
        id: segmentId(raw.id, index + 1),
        raw_artefact_id: raw.id,
        source_id: sourceId(raw),
        locator: {kind: "spreadsheet", sheet, cell_range: range} satisfies SourceLocator,
        text: text.trim(),
        ordinal: index + 1,
      };
    });
}

export function parseArtefactSegments(raw: RawArtefact, content: string): ArtefactSegment[] {
  if (raw.mime === "text/csv") return parseCsv(raw, content);
  if (raw.mime.includes("spreadsheet") || raw.storage_path.endsWith(".xlsx")) return parseSpreadsheetText(raw, content);

  const body = raw.mime === "message/rfc822" ? parseEmailBody(content) : content.trim();
  if (!body) return [];

  return [
    {
      id: segmentId(raw.id, 1),
      raw_artefact_id: raw.id,
      source_id: sourceId(raw),
      locator: {kind: raw.mime === "message/rfc822" ? "email" : "text", part: "body", text_range: `1:${body.length}`} as SourceLocator,
      text: body,
      ordinal: 1,
    },
  ];
}
