import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const modules = new Map();
const es = JSON.parse(await readFile(new URL('../src/data/resume/es.json', import.meta.url), 'utf8'));
const dictionary = JSON.parse(await readFile(new URL('../src/i18n/dictionaries/es.json', import.meta.url), 'utf8'));
let limited = false;
const notes = [{ slug: 'public-note', title: 'Nota pública', href: '/es/notes/public-note', description: 'Nota verificada de ejemplo', publishedAt: '2026-09-01', tags: [], locale: 'es', isSourceLocale: true }];
function compile(source) {
  const compiled = { exports: {} };
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const resolve = name => {
    if (modules.has(name)) return modules.get(name);
    if (name === 'next/server') return { NextResponse: { json: (body, init) => new Response(JSON.stringify(body), init) } };
    if (name === '@/i18n/get-dictionary') return { getDictionary: async () => dictionary };
    if (name === '@/data/get-resume') return { getResume: async () => es };
    if (name === '@/lib/rate-limit') return { checkRateLimit: async () => !limited };
    if (name === '@/content/notes') return { getNotes: () => notes, getLocalizedNotePreview: n => n };
    throw new Error(`Unexpected import ${name}`);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, compiled, compiled.exports);
  return compiled.exports;
}
for (const name of ['chat-response', 'chat-evidence']) modules.set(`@/lib/${name}`, compile(await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8')));
const { parseEvidence, parseAssistantResponse, getReplyPresentation, getRetryDelay } = modules.get('@/lib/chat-response');
const { buildChatEvidence, resolveChatEvidence, getProjectAnchor } = modules.get('@/lib/chat-evidence');
const { POST } = compile(await readFile(new URL('../src/app/api/recruiter-bot/route.ts', import.meta.url), 'utf8'));
const catalog = buildChatEvidence(es, 'es', notes);
const request = body => new Request('https://portfolio.test/api/recruiter-bot', { method: 'POST', body: JSON.stringify(body) });

test('evidence selects bounded real records, never model URLs or unknown identifiers', () => {
  assert.equal(getProjectAnchor('Mango Engineering + Agentic'), 'project-mango-engineering-agentic');
  const ids = ['project:Asiento Libre', 'unknown', 'javascript:alert(1)', 'project:Asiento Libre', 'note:public-note', 'profile:cv'];
  const result = resolveChatEvidence(ids, catalog);
  assert.equal(result.length, 3);
  assert.equal(result[0].href, '/es#project-asiento-libre');
  assert.equal(result[1].href, '/es/notes/public-note');
  assert.deepEqual(parseEvidence([{ ...result[0], href: '//evil.test/es' }, { ...result[0], href: '/es/notes/../../private' }, { ...result[0], href: 'data:text/html,hello' }, result[0], result[0]]), [result[0]]);
  assert.equal(buildChatEvidence(es, 'en', []).find(s => s.id === 'project:Asiento Libre').href, '/en#project-asiento-libre');
});

test('answer preview bounds the first screen while retaining all useful detail', () => {
  const answer = 'Resumen directo.\n\n' + '- Un punto respaldado por evidencia.\n'.repeat(50);
  const result = getReplyPresentation(answer, 'Más contexto verificado.');
  assert(result.preview.length <= 850);
  assert(result.details.endsWith('Más contexto verificado.'));
  assert.equal((result.preview + result.details.replace('Más contexto verificado.', '')).replace(/\s/g, ''), answer.replace(/\s/g, ''));
  assert.equal(getReplyPresentation('Respuesta breve.').details, '');
  assert.equal(getReplyPresentation('x'.repeat(1000)).preview.length, 750);
  assert.equal(parseAssistantResponse({ answer: '' }), null);
  assert.equal(parseAssistantResponse({ answer: 'Bien', details: 4 }).details, undefined);
});

test('retry cooldown obeys delta/date headers and bounded defaults', () => {
  const now = Date.UTC(2026, 9, 3);
  assert.equal(getRetryDelay(429, '30', now), 30);
  assert.equal(getRetryDelay(429, new Date(now + 45_000).toUTCString(), now), 45);
  assert.equal(getRetryDelay(429, null, now), 60);
  assert.equal(getRetryDelay(429, 'NaN', now), 60);
  assert.equal(getRetryDelay(429, '999999', now), 3600);
  assert.equal(getRetryDelay(500, '60', now), 0);
});

test('API validates inputs and exposes a useful 429 cooldown', async () => {
  assert.equal((await POST(request({ message: '' }))).status, 400);
  assert.equal((await POST(request({ message: 'x'.repeat(7001) }))).status, 413);
  limited = true;
  try { const r = await POST(request({ message: 'hola' })); assert.equal(r.status, 429); assert.equal(r.headers.get('Retry-After'), '60'); }
  finally { limited = false; }
});

test('deterministic contact answers are brief, bounded and honest about delivery', async () => {
  const r = await POST(request({ message: '¿Cómo contacto a Matias?', lang: 'es' }));
  const data = await r.json();
  assert.equal(r.status, 200);
  assert(data.answer.includes('no le envía mensajes'));
  assert.equal(data.sources[0].href, '/es/cv');
});

test('Gemini request uses intent, short/deep structure and resolves evidence server-side', async () => {
  const oldFetch = globalThis.fetch, key = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-placeholder';
  let payload;
  globalThis.fetch = async (_url, options) => {
    payload = JSON.parse(options.body);
    return new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ answer: 'Resumen y brechas.', details: 'Detalle verificado.', evidenceIds: ['project:Asiento Libre', 'note:public-note', 'unknown'] }) }] } }] }));
  };
  try {
    const r = await POST(request({ message: '', intent: 'fit', lang: 'es', fileContexts: [{ name: 'oferta.txt', text: 'Oferta pública de backend.' }] }));
    const data = await r.json();
    assert.equal(r.status, 200); assert.equal(data.details, 'Detalle verificado.');
    assert.deepEqual(data.sources.map(s => s.id), ['project:Asiento Libre', 'note:public-note']);
    assert.equal(payload.generationConfig.responseMimeType, 'application/json');
    assert(payload.generationConfig.responseSchema.properties.evidenceIds.items.enum.includes('project:Asiento Libre'));
    assert(payload.contents[0].parts[0].text.includes('Selected intent: fit'));
    assert(payload.systemInstruction.parts[0].text.includes('matches and gaps/unknowns'));
    assert(payload.systemInstruction.parts[0].text.includes('untrusted material'));
  } finally { globalThis.fetch = oldFetch; if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key; }
});

test('provider errors and malformed JSON cannot masquerade as successful answers', async () => {
  const oldFetch = globalThis.fetch, key = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-placeholder';
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'private provider diagnostic' } }), { status: 429 });
    const quota = await POST(request({ message: 'Explicá los proyectos.' }));
    assert.equal(quota.status, 429); assert.equal(quota.headers.get('Retry-After'), '60');
    assert(!(await quota.text()).includes('private provider diagnostic'));
    globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'not valid JSON' }] } }] }));
    assert.equal((await POST(request({ message: 'Explicá los proyectos.' }))).status, 502);
    globalThis.fetch = async () => { throw new DOMException('Timeout', 'TimeoutError'); };
    assert.equal((await POST(request({ message: 'Explicá los proyectos.' }))).status, 504);
  } finally { globalThis.fetch = oldFetch; if (key === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = key; }
});
