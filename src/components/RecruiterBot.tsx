"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaCompress,
  FaExpand,
  FaFileAlt,
  FaFilePdf,
  FaMagic,
  FaPaperclip,
  FaPaperPlane,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  status?: "normal" | "loading" | "error" | "warning";
  attachments?: string[];
};

type BotResponse = {
  answer?: string;
  error?: string;
  missingConfig?: boolean;
};

type ContextFile = {
  id: string;
  name: string;
  kind?: "pdf" | "docx" | "text" | "markdown";
  text: string;
  size?: number;
  pageCount?: number;
  pagesUsed?: number;
  charCount?: number;
  truncated?: boolean;
};

type ContextFileUploadResponse = {
  name?: string;
  kind?: ContextFile["kind"];
  text?: string;
  size?: number;
  pageCount?: number;
  pagesUsed?: number;
  charCount?: number;
  truncated?: boolean;
  code?: string;
  error?: string;
};

const MAX_CHARS = 7000;
const HISTORY_LIMIT = 8;
const MAX_CONTEXT_FILES = 3;
const MAX_CONTEXT_FILE_BYTES = 4 * 1024 * 1024;
const LONG_PASTE_TO_MARKDOWN_CHARS = 1_800;
const MAX_PASTED_MARKDOWN_CHARS = 18_000;

const CONTEXT_FILE_COPY = {
  es: {
    attachLabel: "Adjuntar archivo",
    removeLabel: "Quitar archivo",
    dropTitle: "Soltá el archivo acá",
    dropHint: "Acepto PDF, DOCX, TXT y MD como adjuntos.",
    attachedLabel: "Archivo adjunto",
    parsing: "Leyendo archivo…",
    ready: "archivo listo",
    truncated: "recortado",
    maxFiles: `Podés adjuntar hasta ${MAX_CONTEXT_FILES} archivos.`,
    tooLarge: "Ese archivo es muy pesado. Máximo 4 MB.",
    unsupported: "Acepto PDF, DOCX, TXT o MD.",
    empty: "No encontré texto legible en ese archivo.",
    parseError: "No pude leer ese archivo. Probá con otro.",
    contextHint: "El archivo se envía junto con tu mensaje.",
    pastedTextFileName: "texto-pegado",
  },
  en: {
    attachLabel: "Attach file",
    removeLabel: "Remove file",
    dropTitle: "Drop the file here",
    dropHint: "I accept PDF, DOCX, TXT, and MD as chat context.",
    attachedLabel: "Attached file",
    parsing: "Reading file…",
    ready: "file ready",
    truncated: "trimmed",
    maxFiles: `You can attach up to ${MAX_CONTEXT_FILES} files as context.`,
    tooLarge: "That file is too large. Max 4 MB.",
    unsupported: "I accept PDF, DOCX, TXT, or MD files.",
    empty: "I could not find readable text in that file.",
    parseError: "I could not read that file. Try another one.",
    contextHint: "The file is sent with your message.",
    pastedTextFileName: "pasted-text",
  },
} as const;

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const formatFileSize = (size?: number) => {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getTextSizeInBytes = (text: string) =>
  new TextEncoder().encode(text).length;

const normalizePastedText = (text: string) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

const getMarkdownFileName = (prefix: string) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/\.\d{3}Z$/, "")
    .replace(/[T:]/g, "-");

  return `${prefix}-${timestamp}.md`;
};

const isSupportedContextFile = (file: File) => {
  const name = file.name.toLowerCase();

  return (
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type.startsWith("text/") ||
    name.endsWith(".pdf") ||
    name.endsWith(".docx") ||
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".markdown")
  );
};

const hasFileDrag = (event: DragEvent<HTMLElement>) =>
  Array.from(event.dataTransfer.types).includes("Files");

const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });

const flushList = (
  items: string[],
  elements: ReactNode[],
  keyPrefix: string,
) => {
  if (!items.length) return;

  elements.push(
    <ul key={`${keyPrefix}-${elements.length}`} className="my-2 space-y-1 pl-4">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-item-${index}`} className="list-disc">
          {renderInline(item)}
        </li>
      ))}
    </ul>,
  );
  items.length = 0;
};

const FormattedMessage = ({ content }: { content: string }) => {
  const blocks = useMemo(() => {
    const elements: ReactNode[] = [];
    const pendingList: string[] = [];

    content
      .trim()
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line, index) => {
        const bulletMatch = line.match(/^[-*•]\s+(.+)/);
        const numberedMatch = line.match(/^\d+[.)]\s+(.+)/);
        const headingMatch = line.match(/^#{1,3}\s+(.+)/);

        if (bulletMatch || numberedMatch) {
          pendingList.push((bulletMatch || numberedMatch)?.[1] ?? line);
          return;
        }

        flushList(pendingList, elements, `list-${index}`);

        if (headingMatch) {
          elements.push(
            <p
              key={`heading-${index}`}
              className="mt-3 text-xs font-black uppercase tracking-[0.12em]"
              style={{ color: "var(--color-text)" }}
            >
              {renderInline(headingMatch[1])}
            </p>,
          );
          return;
        }

        elements.push(
          <p key={`paragraph-${index}`} className="my-2 first:mt-0 last:mb-0">
            {renderInline(line)}
          </p>,
        );
      });

    flushList(pendingList, elements, "list-end");

    return elements;
  }, [content]);

  return <>{blocks}</>;
};

const CAT_PIXEL_ROWS = [
  ".............",
  "...M.....M...",
  "..MOM...MOM..",
  ".MOOOMMMOOOM.",
  "MOOOOOMOOOOOM",
  "OOOEOOOOOEOOO",
  "OOOOOOOOOOOOO",
  ".OOOOOOOOOOOT",
  "..OO.O.O.OTTT",
  "...O.O.O.OTT.",
  ".............",
] as const;

const pixelCatClassByToken: Record<string, string> = {
  S: "shadow",
  O: "orange",
  E: "eye",
  M: "initial-m",
  T: "tail",
};

const PixelAssistantAvatar = ({
  isThinking = false,
  size = "launcher",
}: {
  isThinking?: boolean;
  size?: "launcher" | "header" | "composer";
}) => (
  <span
    className={cn(
      "pixel-assistant-avatar",
      `pixel-assistant-avatar--${size}`,
      isThinking && "pixel-assistant-avatar--thinking",
    )}
    aria-hidden="true"
  >
    <span className="pixel-cat__sprite">
      {CAT_PIXEL_ROWS.map((row, rowIndex) =>
        [...row].map((token, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={cn(
              "pixel-cat__pixel",
              token !== "." &&
                `pixel-cat__pixel--${pixelCatClassByToken[token]}`,
            )}
          />
        )),
      )}
    </span>
    <span className="pixel-cat__shadow" />
  </span>
);

export default function RecruiterBot({
  lang,
  dictionary,
  className,
}: {
  lang: Locale;
  dictionary: Dictionary;
  className?: string;
}) {
  const copy = dictionary.recruiterBot;
  const contextFileCopy = CONTEXT_FILE_COPY[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [fileContexts, setFileContexts] = useState<ContextFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: copy.greeting,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const remainingChars = MAX_CHARS - input.length;
  const isTooLong = remainingChars < 0;
  const canSubmit =
    !isSubmitting &&
    !isParsingFile &&
    !isTooLong &&
    (Boolean(input.trim()) || fileContexts.length > 0);

  useEffect(() => {
    const shouldOpenFromHash = ["#recruiter-bot", "#assistant", "#ai"].includes(
      window.location.hash,
    );

    if (shouldOpenFromHash) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) return;

    const shouldFocusComposer = window.matchMedia(
      "(min-width: 640px) and (pointer: fine)",
    ).matches;

    if (!shouldFocusComposer) return;

    const focusTimer = window.setTimeout(
      () => textareaRef.current?.focus(),
      320,
    );

    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setIsOpen(false);
      setIsExpanded(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const visibleHistory = useMemo(
    () =>
      messages
        .filter((message) => message.status !== "loading")
        .slice(-HISTORY_LIMIT)
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const appendAssistantMessage = (
    pendingId: string,
    content: string,
    status: ChatMessage["status"] = "normal",
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === pendingId
          ? {
              ...message,
              content,
              status,
            }
          : message,
      ),
    );
  };

  const getContextFileUploadError = (data?: ContextFileUploadResponse) => {
    if (data?.code === "file_too_large") return contextFileCopy.tooLarge;
    if (
      data?.code === "unsupported_file" ||
      data?.code === "not_pdf" ||
      data?.code === "invalid_file"
    ) {
      return contextFileCopy.unsupported;
    }
    if (data?.code === "empty_file" || data?.code === "empty_pdf") {
      return contextFileCopy.empty;
    }

    return contextFileCopy.parseError;
  };

  const uploadContextFiles = async (selectedFiles: File[]) => {
    const availableSlots = MAX_CONTEXT_FILES - fileContexts.length;

    if (availableSlots <= 0) {
      setFileError(contextFileCopy.maxFiles);
      return;
    }

    const contextFiles = selectedFiles.filter(isSupportedContextFile);
    if (!contextFiles.length) {
      setFileError(contextFileCopy.unsupported);
      return;
    }

    const filesToUpload = contextFiles.slice(0, availableSlots);
    if (
      contextFiles.length > availableSlots ||
      selectedFiles.length > contextFiles.length
    ) {
      setFileError(
        contextFiles.length > availableSlots
          ? contextFileCopy.maxFiles
          : contextFileCopy.unsupported,
      );
    } else {
      setFileError(null);
    }

    setIsParsingFile(true);

    try {
      const uploadedContexts: ContextFile[] = [];

      for (const file of filesToUpload) {
        if (file.size > MAX_CONTEXT_FILE_BYTES) {
          setFileError(contextFileCopy.tooLarge);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/recruiter-bot/context-file", {
          method: "POST",
          body: formData,
        });
        const data = (await response
          .json()
          .catch(() => ({}))) as ContextFileUploadResponse;

        if (!response.ok || !data.text || !data.name) {
          setFileError(getContextFileUploadError(data));
          continue;
        }

        uploadedContexts.push({
          id: createId(),
          name: data.name,
          kind: data.kind,
          text: data.text,
          size: data.size ?? file.size,
          pageCount: data.pageCount,
          pagesUsed: data.pagesUsed,
          charCount: data.charCount ?? data.text.length,
          truncated: data.truncated,
        });
      }

      if (uploadedContexts.length) {
        setFileContexts((current) =>
          [...current, ...uploadedContexts].slice(0, MAX_CONTEXT_FILES),
        );
      }
    } catch {
      setFileError(contextFileCopy.parseError);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleContextFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    void uploadContextFiles(files);
  };

  const handleContextFileDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFileDrag(event)) return;

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDraggingFile(true);
  };

  const handleContextFileDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFileDrag(event)) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingFile(true);
  };

  const handleContextFileDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFileDrag(event)) return;

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDraggingFile(false);
    }
  };

  const handleContextFileDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFileDrag(event)) return;

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDraggingFile(false);
    void uploadContextFiles(Array.from(event.dataTransfer.files || []));
  };

  const removeContextFile = (id: string) => {
    setFileContexts((current) =>
      current.filter((context) => context.id !== id),
    );
    setFileError(null);
  };

  const attachPastedMarkdownContext = (pastedText: string) => {
    const normalizedText = normalizePastedText(pastedText);
    if (!normalizedText) return false;

    if (fileContexts.length >= MAX_CONTEXT_FILES) {
      setFileError(contextFileCopy.maxFiles);
      return true;
    }

    const markdownBody =
      normalizedText.length > MAX_PASTED_MARKDOWN_CHARS
        ? normalizedText.slice(0, MAX_PASTED_MARKDOWN_CHARS).trim()
        : normalizedText;
    const markdownText = `# Texto pegado\n\n${markdownBody}`;
    const size = getTextSizeInBytes(markdownText);

    if (size > MAX_CONTEXT_FILE_BYTES) {
      setFileError(contextFileCopy.tooLarge);
      return true;
    }

    const fileName = getMarkdownFileName(contextFileCopy.pastedTextFileName);

    setFileContexts((current) => [
      ...current,
      {
        id: createId(),
        name: fileName,
        kind: "markdown",
        text: markdownText,
        size,
        charCount: markdownText.length,
        truncated: normalizedText.length > MAX_PASTED_MARKDOWN_CHARS,
      },
    ]);
    setFileError(null);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
    return true;
  };

  const handleComposerPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData("text/plain");
    const normalizedText = normalizePastedText(pastedText);

    if (!normalizedText) return;

    const shouldAttachAsMarkdown =
      normalizedText.length >= LONG_PASTE_TO_MARKDOWN_CHARS ||
      input.length + normalizedText.length > MAX_CHARS;

    if (!shouldAttachAsMarkdown) return;

    event.preventDefault();
    attachPastedMarkdownContext(normalizedText);
  };

  const submitMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedInput = input.trim();
    if (
      (!trimmedInput && fileContexts.length === 0) ||
      isSubmitting ||
      isParsingFile
    ) {
      return;
    }

    if (trimmedInput.length > MAX_CHARS) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: copy.tooLongError,
          status: "error",
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedInput,
      attachments: fileContexts.map((context) => context.name),
    };
    const pendingId = createId();
    const pendingMessage: ChatMessage = {
      id: pendingId,
      role: "assistant",
      content: copy.loading,
      status: "loading",
    };

    const contextsForRequest = fileContexts.map(
      ({ name, kind, text, pageCount, pagesUsed, truncated }) => ({
        name,
        kind,
        text,
        pageCount,
        pagesUsed,
        truncated,
      }),
    );

    setInput("");
    setFileContexts([]);
    setFileError(null);
    setIsSubmitting(true);
    setMessages((current) => [...current, userMessage, pendingMessage]);

    try {
      const response = await fetch("/api/recruiter-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang,
          message: trimmedInput,
          messages: [...visibleHistory, userMessage].slice(-HISTORY_LIMIT),
          fileContexts: contextsForRequest,
        }),
      });

      const data = (await response.json()) as BotResponse;

      if (data.answer) {
        appendAssistantMessage(
          pendingId,
          data.answer,
          data.missingConfig ? "warning" : "normal",
        );
        return;
      }

      if (response.status === 429) {
        appendAssistantMessage(pendingId, copy.rateLimitError, "error");
        return;
      }

      appendAssistantMessage(pendingId, copy.genericError, "error");
    } catch {
      appendAssistantMessage(pendingId, copy.genericError, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  return (
    <aside
      aria-label={copy.ariaLabel}
      className={cn(
        "assistant-bot-shell pointer-events-none z-[80]",
        isOpen &&
          !isExpanded &&
          "assistant-bot-shell--open fixed right-0 w-full max-w-none sm:right-4 sm:w-[calc(100vw-2rem)] sm:max-w-[440px] md:right-6",
        isOpen &&
          isExpanded &&
          "assistant-bot-shell--open assistant-bot-shell--expanded fixed inset-0 w-full max-w-none",
        !isOpen &&
          "assistant-bot-shell--closed relative mb-8 ml-auto mr-4 w-[calc(100vw-2rem)] max-w-[440px] sm:fixed sm:mb-0 sm:mr-0 sm:right-4 md:right-6",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.button
            key="assistant-launcher"
            type="button"
            onClick={() => setIsOpen(true)}
            className="group pointer-events-auto relative ml-auto flex cursor-pointer items-end rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            aria-label={copy.openLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <span
              aria-hidden="true"
              className="assistant-launcher-bubble pointer-events-none absolute bottom-9 right-[calc(100%-0.15rem)] z-10 hidden w-max px-3 py-2 sm:block sm:max-w-52"
            >
              <span className="assistant-launcher-bubble__tail" />
              <span className="relative block text-xs font-normal leading-tight tracking-normal">
                {copy.launcherBubble}
              </span>
            </span>
            <span className="control-hover relative inline-block rounded-2xl p-2">
              <PixelAssistantAvatar />
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="assistant-panel"
            className={cn(
              "pointer-events-auto relative flex w-full overflow-hidden overscroll-contain border backdrop-blur-2xl",
              isExpanded
                ? "h-[100svh] max-h-[100svh] min-h-[100svh] rounded-none"
                : "max-h-[100svh] min-h-[520px] rounded-b-none rounded-t-3xl sm:max-h-[calc(100svh-2rem)] sm:rounded-3xl md:min-h-[580px] lg:max-h-[calc(100svh-7rem)]",
            )}
            style={{
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--color-background) 93%, transparent), color-mix(in srgb, var(--color-surface) 84%, transparent))",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 10%, var(--color-border))",
              boxShadow:
                "0 28px 90px var(--shadow-hover), inset 0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent)",
              transformOrigin: "bottom right",
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onDragEnter={handleContextFileDragEnter}
            onDragOver={handleContextFileDragOver}
            onDragLeave={handleContextFileDragLeave}
            onDrop={handleContextFileDrop}
          >
            <div className="relative flex min-h-0 w-full flex-col">
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[color:var(--color-background)]/82 px-6 opacity-0 backdrop-blur-md transition-opacity duration-200",
                  isDraggingFile && "opacity-100",
                )}
                aria-hidden={!isDraggingFile}
              >
                <div
                  className="max-w-sm rounded-3xl border px-6 py-5 text-center shadow-2xl"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-primary) 32%, var(--color-border))",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-surface) 88%, transparent)",
                  }}
                >
                  <FaFileAlt
                    aria-hidden="true"
                    className="mx-auto mb-3"
                    size={28}
                    style={{ color: "var(--color-primary)" }}
                  />
                  <p
                    className="text-base font-black"
                    style={{ color: "var(--color-text)" }}
                  >
                    {contextFileCopy.dropTitle}
                  </p>
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {contextFileCopy.dropHint}
                  </p>
                </div>
              </div>

              <header
                className="flex min-h-[4.75rem] items-center gap-3 border-b px-4 py-3"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 12%, var(--color-border))",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface) 46%, transparent)",
                }}
              >
                <PixelAssistantAvatar size="header" />
                <div className="min-w-0 flex-1">
                  <h2
                    className="text-sm font-bold leading-tight text-balance"
                    style={{ color: "var(--color-text)" }}
                  >
                    {copy.title}
                  </h2>
                  <p
                    className="mt-1 truncate text-xs font-medium"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {copy.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsExpanded((current) => !current)}
                    className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[color:var(--color-card-hover)] sm:flex"
                    style={{ color: "var(--color-muted)" }}
                    aria-label={
                      isExpanded ? copy.collapseLabel : copy.expandLabel
                    }
                    aria-pressed={isExpanded}
                    title={
                      isExpanded ? copy.collapseLabel : copy.expandLabel
                    }
                  >
                    {isExpanded ? (
                      <FaCompress aria-hidden="true" size={14} />
                    ) : (
                      <FaExpand aria-hidden="true" size={14} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeChat}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[color:var(--color-card-hover)]"
                    style={{ color: "var(--color-muted)" }}
                    aria-label={copy.closeLabel}
                  >
                    <FaTimes aria-hidden="true" size={15} />
                  </button>
                </div>
              </header>

              <div
                ref={messagesRef}
                className="assistant-messages-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pt-4"
                aria-live="polite"
              >
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  const isLoading = message.status === "loading";

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        isUser ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[88%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed",
                          isUser ? "rounded-br-md" : "rounded-bl-md border",
                        )}
                        style={{
                          color: isUser
                            ? "var(--color-background)"
                            : message.status === "error"
                              ? "var(--color-warning)"
                              : "var(--color-text)",
                          backgroundColor: isUser
                            ? "var(--color-primary)"
                            : message.status === "warning"
                              ? "color-mix(in srgb, var(--color-warning) 10%, var(--color-surface))"
                              : "color-mix(in srgb, var(--color-surface) 76%, transparent)",
                          borderColor:
                            message.status === "warning"
                              ? "color-mix(in srgb, var(--color-warning) 36%, var(--color-border))"
                              : "var(--color-border)",
                        }}
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center gap-2">
                            <FaMagic
                              aria-hidden="true"
                              className="animate-pulse"
                              size={13}
                            />
                            {copy.loading}
                          </span>
                        ) : isUser ? (
                          <>
                            {message.content ? <p>{message.content}</p> : null}
                            {message.attachments?.length ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {message.attachments.map((attachment) => (
                                  <span
                                    key={attachment}
                                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold"
                                    style={{
                                      backgroundColor:
                                        "color-mix(in srgb, var(--color-background) 18%, transparent)",
                                    }}
                                  >
                                    <FaFileAlt aria-hidden="true" size={10} />
                                    {attachment}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <FormattedMessage content={message.content} />
                        )}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 1 && !isSubmitting ? (
                  <div
                    className="max-w-[88%] space-y-2 pb-2"
                    aria-label={copy.suggestionsLabel}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {copy.suggestionsLabel}
                    </p>
                    <div className="grid gap-2">
                      {copy.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setInput(suggestion);
                            textareaRef.current?.focus();
                          }}
                          className="min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-snug transition-[background-color,border-color,color] duration-200 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-card-hover)]"
                          style={{
                            color: "var(--color-text-secondary)",
                            borderColor: "var(--color-border)",
                            backgroundColor:
                              "color-mix(in srgb, var(--color-surface) 54%, transparent)",
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="assistant-composer-dock pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-3 pt-6">
                <div
                  className={cn(
                    "assistant-composer-avatar-row pointer-events-none -mb-[3px] mr-5 flex justify-end",
                    isExpanded && "assistant-composer-avatar-row--expanded",
                  )}
                >
                  <PixelAssistantAvatar
                    isThinking={isSubmitting}
                    size="composer"
                  />
                </div>
                <form
                  onSubmit={submitMessage}
                  className="assistant-composer pointer-events-auto relative rounded-2xl border p-2"
                  data-too-long={isTooLong ? "true" : undefined}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf,.docx,.txt,.md,.markdown,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple
                    className="hidden"
                    onChange={handleContextFileInputChange}
                  />
                  {(fileContexts.length > 0 || fileError || isParsingFile) && (
                    <div className="mb-2 space-y-2 px-2 pt-1">
                      {fileContexts.length > 0 && (
                        <div>
                          <p
                            className="mb-1 text-xs font-black uppercase tracking-[0.14em]"
                            style={{ color: "var(--color-muted)" }}
                          >
                            {contextFileCopy.attachedLabel}
                          </p>
                          <div className="flex max-h-20 flex-wrap gap-1.5 overflow-y-auto pr-1">
                            {fileContexts.map((context) => (
                              <span
                                key={context.id}
                                className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold"
                                style={{
                                  color: "var(--color-text)",
                                  borderColor:
                                    "color-mix(in srgb, var(--color-primary) 24%, var(--color-border))",
                                  backgroundColor:
                                    "color-mix(in srgb, var(--color-primary) 7%, transparent)",
                                }}
                                title={context.name}
                              >
                                {context.kind === "pdf" ? (
                                  <FaFilePdf
                                    aria-hidden="true"
                                    className="shrink-0"
                                    size={10}
                                    style={{ color: "var(--color-primary)" }}
                                  />
                                ) : (
                                  <FaFileAlt
                                    aria-hidden="true"
                                    className="shrink-0"
                                    size={10}
                                    style={{ color: "var(--color-primary)" }}
                                  />
                                )}
                                <span className="max-w-[170px] truncate">
                                  {context.name}
                                </span>
                                <span
                                  className="shrink-0 font-semibold"
                                  style={{ color: "var(--color-muted)" }}
                                >
                                  {context.pagesUsed
                                    ? `${context.pagesUsed}p`
                                    : formatFileSize(context.size)}
                                  {context.truncated
                                    ? ` · ${contextFileCopy.truncated}`
                                    : ""}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeContextFile(context.id)}
                                    className="-mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[color:var(--color-card-hover)]"
                                  aria-label={`${contextFileCopy.removeLabel}: ${context.name}`}
                                  title={contextFileCopy.removeLabel}
                                >
                                    <FaTrash aria-hidden="true" size={9} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {isParsingFile && (
                        <p
                          className="inline-flex items-center gap-2 text-xs font-bold"
                          style={{ color: "var(--color-muted)" }}
                          role="status"
                        >
                          <FaMagic
                            aria-hidden="true"
                            className="animate-pulse"
                            size={11}
                          />
                          {contextFileCopy.parsing}
                        </p>
                      )}
                      {fileError && (
                        <p
                          className="text-xs font-bold"
                          style={{ color: "var(--color-warning)" }}
                          role="alert"
                        >
                          {fileError}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={
                        isParsingFile ||
                        fileContexts.length >= MAX_CONTEXT_FILES
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform,opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-45"
                      style={{
                        color: "var(--color-text)",
                        borderColor:
                          "color-mix(in srgb, var(--color-primary) 20%, var(--color-border))",
                        backgroundColor:
                          "color-mix(in srgb, var(--color-surface) 82%, transparent)",
                      }}
                      aria-label={contextFileCopy.attachLabel}
                      title={contextFileCopy.attachLabel}
                    >
                      <FaPaperclip aria-hidden="true" size={14} />
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                      onPaste={handleComposerPaste}
                      placeholder={
                        fileContexts.length
                          ? `${copy.placeholder} ${contextFileCopy.contextHint}`
                          : copy.placeholder
                      }
                      rows={2}
                      maxLength={MAX_CHARS}
                      name="portfolio-assistant-question"
                      autoComplete="off"
                      aria-label={copy.inputLabel}
                      className="max-h-32 min-h-12 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-sm font-medium leading-relaxed outline-none focus:outline-none focus-visible:outline-none placeholder:text-[color:var(--color-muted)]"
                      style={{ color: "var(--color-text)" }}
                    />
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[background-color,border-color,color,transform,opacity,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-45"
                      style={{
                        color: "var(--color-background)",
                        backgroundColor: "var(--color-primary)",
                        boxShadow:
                          "0 10px 22px color-mix(in srgb, var(--color-primary) 12%, transparent)",
                      }}
                      aria-label={copy.sendButton}
                    >
                      <FaPaperPlane aria-hidden="true" size={14} />
                    </button>
                  </div>
                  <div
                    className="mt-1 flex items-center justify-between gap-3 px-2 text-xs font-semibold"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <span>
                      {fileContexts.length
                        ? `${copy.privacyNote} ${contextFileCopy.contextHint}`
                        : copy.privacyNote}
                    </span>
                    <span
                      style={{
                        color:
                          remainingChars < 500
                            ? "var(--color-warning)"
                            : "var(--color-muted)",
                      }}
                    >
                      {remainingChars}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
