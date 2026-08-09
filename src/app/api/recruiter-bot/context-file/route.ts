import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_PDF_PAGES = 25;
const MAX_EXTRACTED_TEXT_CHARS = 18_000;
const PDF_MAGIC_BYTES = "%PDF";
const ZIP_MAGIC_BYTES = "PK";

type ContextFileKind = "pdf" | "docx" | "text" | "markdown";

type ContextFileErrorCode =
  | "missing_file"
  | "invalid_file"
  | "file_too_large"
  | "unsupported_file"
  | "empty_file"
  | "parse_failed";

type ContextFileMeta = {
  kind: ContextFileKind;
  pageCount?: number;
  pagesUsed?: number;
  warnings?: string[];
};

const getClientId = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip") || "unknown";
};

const RATE_LIMIT_MAX_REQUESTS = 10;

const errorResponse = (
  code: ContextFileErrorCode,
  status: number,
  detail?: string,
) =>
  NextResponse.json(
    {
      code,
      error: detail || code,
    },
    { status },
  );

const logExtractionError = (error: unknown) => {
  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
      : String(error);

  process.stderr.write(
    `[recruiter-bot/context-file] extraction failed\n${message}\n`,
  );
};

const sanitizeFileName = (name: string) =>
  name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

const normalizeExtractedText = (text: string) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

const readAscii = (bytes: Uint8Array, length: number) =>
  new TextDecoder("ascii").decode(bytes.slice(0, length));

const hasMagicBytes = (bytes: Uint8Array, magic: string) =>
  readAscii(bytes, magic.length) === magic;

const getExtension = (fileName: string) =>
  fileName.toLowerCase().split(".").pop() || "";

const detectFileKind = (
  file: File,
  fileName: string,
): ContextFileKind | null => {
  const extension = getExtension(fileName);
  const type = file.type.toLowerCase();

  if (type === "application/pdf" || extension === "pdf") return "pdf";

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return "docx";
  }

  if (
    type === "text/markdown" ||
    extension === "md" ||
    extension === "markdown"
  ) {
    return "markdown";
  }

  if (type.startsWith("text/") || extension === "txt") return "text";

  return null;
};

const installPdfJsDomPolyfills = () => {
  const globals = globalThis as Record<string, unknown>;

  globals.DOMMatrix ??= class MinimalDOMMatrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;

    constructor(init?: unknown) {
      if (Array.isArray(init) || ArrayBuffer.isView(init)) {
        const values = Array.from(init as ArrayLike<number>);
        if (values.length >= 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = values;
        }
        return;
      }

      if (init && typeof init === "object") {
        const matrix = init as Record<string, number>;
        this.a = Number(matrix.a ?? matrix.m11 ?? this.a);
        this.b = Number(matrix.b ?? matrix.m12 ?? this.b);
        this.c = Number(matrix.c ?? matrix.m21 ?? this.c);
        this.d = Number(matrix.d ?? matrix.m22 ?? this.d);
        this.e = Number(matrix.e ?? matrix.m41 ?? this.e);
        this.f = Number(matrix.f ?? matrix.m42 ?? this.f);
      }
    }

    multiplySelf() {
      return this;
    }

    preMultiplySelf() {
      return this;
    }

    translateSelf(x = 0, y = 0) {
      this.e += Number(x) || 0;
      this.f += Number(y) || 0;
      return this;
    }

    scaleSelf(x = 1, y = x) {
      this.a *= Number(x) || 1;
      this.d *= Number(y) || 1;
      return this;
    }

    rotateSelf() {
      return this;
    }

    invertSelf() {
      return this;
    }

    multiply() {
      const MatrixConstructor = (
        globalThis as unknown as {
          DOMMatrix: new (init?: unknown) => MinimalDOMMatrix;
        }
      ).DOMMatrix;

      return new MatrixConstructor(this);
    }

    translate(x = 0, y = 0) {
      return this.multiply().translateSelf(x, y);
    }

    scale(x = 1, y = x) {
      return this.multiply().scaleSelf(x, y);
    }
  };

  globals.ImageData ??= class MinimalImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    colorSpace = "srgb";

    constructor(
      dataOrWidth: Uint8ClampedArray | number,
      widthOrHeight: number,
      height?: number,
    ) {
      if (typeof dataOrWidth === "number") {
        this.width = dataOrWidth;
        this.height = widthOrHeight;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
        return;
      }

      this.data = dataOrWidth;
      this.width = widthOrHeight;
      this.height =
        height ?? Math.max(1, Math.floor(this.data.length / (this.width * 4)));
    }
  };

  globals.Path2D ??= class MinimalPath2D {
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    arcTo() {}
    ellipse() {}
    rect() {}
    roundRect() {}
  };
};

const extractPdfText = async (
  bytes: Uint8Array,
): Promise<{
  text: string;
  meta: ContextFileMeta;
}> => {
  let parser:
    | {
        getText: (options: {
          first: number;
          pageJoiner: string;
        }) => Promise<{ text: string; total: number }>;
        destroy: () => Promise<void>;
      }
    | undefined;

  try {
    installPdfJsDomPolyfills();
    const { PDFParse } = await import("pdf-parse");

    parser = new PDFParse({ data: bytes });
    const result = await parser.getText({
      first: MAX_PDF_PAGES,
      pageJoiner: "\n\n--- PDF page page_number of total_number ---\n\n",
    });

    return {
      text: result.text,
      meta: {
        kind: "pdf",
        pageCount: result.total,
        pagesUsed: Math.min(result.total, MAX_PDF_PAGES),
      },
    };
  } finally {
    await parser?.destroy().catch(() => undefined);
  }
};

const extractDocxText = async (
  bytes: Uint8Array,
): Promise<{
  text: string;
  meta: ContextFileMeta;
}> => {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });

  return {
    text: result.value,
    meta: {
      kind: "docx",
      warnings: result.messages?.map((message) => message.message),
    },
  };
};

const extractPlainText = (
  bytes: Uint8Array,
  kind: "text" | "markdown",
): {
  text: string;
  meta: ContextFileMeta;
} => ({
  text: new TextDecoder("utf-8", { fatal: false }).decode(bytes),
  meta: { kind },
});

export async function POST(request: Request) {
  try {
    const clientId = getClientId(request);
    if (!(await checkRateLimit({
      clientId,
      limit: RATE_LIMIT_MAX_REQUESTS,
      scope: "recruiter-file",
    }))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse("missing_file", 400);
    }

    const fileName = sanitizeFileName(file.name || "uploaded-file");
    const fileKind = detectFileKind(file, fileName);

    if (!fileKind) {
      return errorResponse("unsupported_file", 415);
    }

    if (file.size <= 0) {
      return errorResponse("invalid_file", 400);
    }

    if (file.size > MAX_FILE_BYTES) {
      return errorResponse("file_too_large", 413);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    if (fileKind === "pdf" && !hasMagicBytes(bytes, PDF_MAGIC_BYTES)) {
      return errorResponse("unsupported_file", 415);
    }

    if (fileKind === "docx" && !hasMagicBytes(bytes, ZIP_MAGIC_BYTES)) {
      return errorResponse("unsupported_file", 415);
    }

    const extracted =
      fileKind === "pdf"
        ? await extractPdfText(bytes)
        : fileKind === "docx"
          ? await extractDocxText(bytes)
          : extractPlainText(bytes, fileKind);

    const extractedText = normalizeExtractedText(extracted.text);

    if (!extractedText) {
      return errorResponse("empty_file", 422);
    }

    const text =
      extractedText.length > MAX_EXTRACTED_TEXT_CHARS
        ? extractedText.slice(0, MAX_EXTRACTED_TEXT_CHARS).trim()
        : extractedText;

    return NextResponse.json({
      name: fileName,
      kind: extracted.meta.kind,
      text,
      size: file.size,
      pageCount: extracted.meta.pageCount,
      pagesUsed: extracted.meta.pagesUsed,
      charCount: text.length,
      truncated:
        (extracted.meta.pageCount ?? 0) > MAX_PDF_PAGES ||
        extractedText.length > MAX_EXTRACTED_TEXT_CHARS,
      warnings: extracted.meta.warnings,
      limits: {
        maxBytes: MAX_FILE_BYTES,
        maxPdfPages: MAX_PDF_PAGES,
        maxTextChars: MAX_EXTRACTED_TEXT_CHARS,
      },
    });
  } catch (error) {
    logExtractionError(error);
    return errorResponse("parse_failed", 500);
  }
}
