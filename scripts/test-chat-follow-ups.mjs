import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/chat-follow-ups.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getChatFollowUps } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const followUps = {
  leadership: ["Leadership 1", "Leadership 2"],
  projects: ["Projects 1", "Projects 2"],
  fit: ["Fit 1", "Fit 2"],
  contact: ["Contact 1", "Contact 2"],
  general: ["General 1", "General 2"],
};

test("follow-ups change with the visitor's question", () => {
  assert.deepEqual(getChatFollowUps(["¿Qué proyectos llevó a producción?"], followUps), followUps.projects);
  assert.deepEqual(getChatFollowUps(["¿Cómo lideró al equipo?"], followUps), followUps.leadership);
  assert.deepEqual(getChatFollowUps(["¿Encaja con esta vacante?"], followUps), followUps.fit);
  assert.deepEqual(getChatFollowUps(["How do I contact him?"], followUps), followUps.contact);
  assert.deepEqual(getChatFollowUps(["Tell me more"], followUps), followUps.general);
});

test("follow-ups preserve the topic but never repeat an earlier question", () => {
  assert.deepEqual(
    getChatFollowUps(["¿Qué proyectos llevó a producción?", "Projects 1", "Tell me more"], followUps),
    ["Projects 2", "General 1"],
  );
  assert.deepEqual(getChatFollowUps(["General 1"], followUps), ["General 2"]);
});
