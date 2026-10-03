"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils";
import PixelWolfAvatar from "@/components/PixelWolfAvatar";
import { getChatFollowUps } from "@/lib/chat-follow-ups";
import { getReplyScrollTop } from "@/lib/chat-scroll";
import { activateOverlayModal, observeOverlayViewport } from "@/lib/overlay-dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getReplyPresentation, getRetryDelay, getRetryWindow, parseAssistantResponse } from "@/lib/chat-response";
import type { ChatEvidence } from "@/lib/chat-response";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type MessageRole = "assistant" | "user";
type ChatIntent = "general" | "experience" | "fit" | "project";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  status?: "normal" | "loading" | "error" | "warning";
  attachments?: string[];
  details?: string;
  sources?: ChatEvidence[];
  retryRequest?: ChatRequestSnapshot;
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

type ChatRequestSnapshot = {
  lang: Locale;
  message: string;
  messages: Array<{ role: MessageRole; content: string }>;
  fileContexts: ContextFile[];
  intent: ChatIntent;
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
  const [launcherPhase, setLauncherPhase] = useState<"peeking" | "settled">("peeking");
  const reduceMotion = useReducedMotion();
  const shouldPeek = launcherPhase === "peeking" && !reduceMotion;
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [composerIntent, setComposerIntent] = useState<ChatIntent>("general");
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
  const responseAnchorIdRef = useRef<string | null>(null);
  const followPendingRef = useRef(true);
  const savedScrollTopRef = useRef(0);
  const previousContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const shellRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [panelElement, setPanelElement] = useState<HTMLDivElement | null>(null);
  const isSmallScreen = useMediaQuery("(max-width: 639px), (pointer: coarse)");
  const isModal = isSmallScreen || isExpanded;
  const wasOpenRef = useRef(false);
  const requestInFlightRef = useRef(false);
  const requestControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const [retryAvailableAt, setRetryAvailableAt] = useState(0);
  const [retryClock, setRetryClock] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; requestControllerRef.current?.abort(); };
  }, []);

  useEffect(() => {
    if (!retryAvailableAt) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setRetryClock(now);
      if (now >= retryAvailableAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAvailableAt]);
  const retryWaitSeconds = Math.max(0, Math.ceil((retryAvailableAt - retryClock) / 1000));

  const closeChat = useCallback(() => {
    textareaRef.current?.blur();
    setIsOpen(false);
    setIsExpanded(false);
    setIsDraggingFile(false);
    dragDepthRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isOpen || !panelElement || !shellRef.current) return;
    return observeOverlayViewport(shellRef.current);
  }, [isOpen, panelElement]);

  useEffect(() => {
    if (!isOpen || !isModal || !panelElement || !closeRef.current) return;
    return activateOverlayModal(panelElement, closeRef.current, closeChat);
  }, [isOpen, isModal, panelElement, closeChat]);

  useEffect(() => {
    const shouldRestoreFocus = wasOpenRef.current && !isOpen;
    wasOpenRef.current = isOpen;
    if (!shouldRestoreFocus) return;
    // AnimatePresence mounts the launcher after the outgoing panel has settled.
    const timer = window.setTimeout(() => launcherRef.current?.focus({ preventScroll: true }), 400);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const remainingChars = MAX_CHARS - input.length;
  const isTooLong = remainingChars < 0;
  const canSubmit =
    !isSubmitting &&
    !isParsingFile &&
    !isTooLong &&
    retryWaitSeconds === 0 &&
    (Boolean(input.trim()) || fileContexts.length > 0);
  const lastMessage = messages[messages.length - 1];
  const askedQuestions = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content);
  const showFollowUps =
    messages.length > 1 &&
    lastMessage?.role === "assistant" &&
    lastMessage.status === "normal" &&
    !isSubmitting &&
    !input.trim() &&
    fileContexts.length === 0;
  const suggestions =
    messages.length === 1
      ? copy.suggestions
      : showFollowUps && askedQuestions.length > 0
        ? getChatFollowUps(askedQuestions, copy.followUps)
        : [];
  const composerPlaceholder = composerIntent === "fit"
    ? copy.rolePastePlaceholder
    : composerIntent === "project" ? copy.projectPlaceholder
    : fileContexts.length
      ? `${copy.placeholder} ${contextFileCopy.contextHint}`
      : copy.placeholder;

  useEffect(() => {
    const shouldOpenFromHash = ["#recruiter-bot", "#assistant", "#ai"].includes(
      window.location.hash,
    );

    if (shouldOpenFromHash) {
      setIsOpen(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !panelElement) return;

    const container = messagesRef.current;
    if (!container) return;

    if (previousContainerRef.current !== container) {
      previousContainerRef.current = container;
      container.scrollTop = savedScrollTopRef.current;
      return;
    }

    const responseId = responseAnchorIdRef.current;
    const latestMessage = messages[messages.length - 1];

    if (
      responseId &&
      latestMessage.id === responseId &&
      latestMessage.status !== "loading"
    ) {
      responseAnchorIdRef.current = null;

      // If the visitor browsed earlier messages while waiting, leave their
      // reading position alone instead of pulling them to the new answer.
      if (!followPendingRef.current) return;

      const reply = container.querySelector<HTMLElement>(
        `[data-chat-message-id="${responseId}"]`,
      );
      if (reply) {
        const replyTop =
          container.scrollTop +
          reply.getBoundingClientRect().top -
          container.getBoundingClientRect().top;

        container.scrollTop = getReplyScrollTop(
          replyTop,
          container.scrollHeight,
          container.clientHeight,
        );
        return;
      }
    }

    container.scrollTop = container.scrollHeight;
  }, [isOpen, messages, panelElement]);

  useEffect(() => {
    if (!isOpen || isModal) return;

    const shouldFocusComposer = window.matchMedia(
      "(min-width: 640px) and (pointer: fine)",
    ).matches;

    if (!shouldFocusComposer) return;

    const focusTimer = window.setTimeout(
      () => textareaRef.current?.focus(),
      320,
    );

    return () => window.clearTimeout(focusTimer);
  }, [isOpen, isModal]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      closeChat();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeChat]);

  const visibleHistory = useMemo(
    () =>
      messages
        .filter((message) => !message.status || message.status === "normal")
        .slice(-HISTORY_LIMIT)
        .map(({ role, content, details }) => ({ role, content: [content, details].filter(Boolean).join("\n\n") })),
    [messages],
  );

  const appendAssistantMessage = (
    pendingId: string,
    content: string,
    status: ChatMessage["status"] = "normal",
    extras: Pick<ChatMessage, "details" | "sources" | "retryRequest"> = {},
  ) => {
    responseAnchorIdRef.current = pendingId;
    if (!mountedRef.current) return;
    setMessages((current) =>
      current.map((message) =>
        message.id === pendingId
          ? {
              ...message,
              content,
              status,
              ...extras,
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
      isParsingFile || requestInFlightRef.current || retryWaitSeconds > 0
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

    const snapshot: ChatRequestSnapshot = {
      lang, message: trimmedInput,
      messages: [...visibleHistory, { role: userMessage.role, content: userMessage.content }].slice(-HISTORY_LIMIT),
      fileContexts: fileContexts.map((file) => ({ ...file })), intent: composerIntent,
    };

    setInput("");
    setComposerIntent("general");
    setFileContexts([]);
    setFileError(null);
    responseAnchorIdRef.current = null;
    followPendingRef.current = true;
    setMessages((current) => [...current, userMessage, pendingMessage]);
    await handleChatRequest(snapshot, pendingId);
  };

  const handleChatRequest = async (snapshot: ChatRequestSnapshot, pendingId: string) => {
    if (requestInFlightRef.current || retryWaitSeconds > 0) return;
    requestInFlightRef.current = true;
    setIsSubmitting(true);
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 35_000);

    try {
      const response = await fetch("/api/recruiter-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(snapshot),
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => null)) as BotResponse | null;

      // A provider can return a helpful error message in `answer` with HTTP 429
      // or 503. It is still a failed request, never a successful assistant turn.
      if (!response.ok) {
        const delay = getRetryDelay(response.status, response.headers?.get("Retry-After") ?? null);
        if (delay && mountedRef.current) {
          const window = getRetryWindow(delay);
          setRetryClock(window.now);
          setRetryAvailableAt(window.availableAt);
        }
        appendAssistantMessage(
          pendingId, response.status === 429 ? copy.rateLimitError
            : response.status === 503 ? copy.unavailableError
            : response.status === 504 ? copy.timeoutError : copy.genericError,
          "error", { retryRequest: snapshot },
        );
        return;
      }

      const reply = parseAssistantResponse(data);
      if (reply) {
        appendAssistantMessage(pendingId, reply.answer, "normal", { details: reply.details, sources: reply.sources });
        return;
      }

      appendAssistantMessage(pendingId, copy.genericError, "error", { retryRequest: snapshot });
    } catch {
      appendAssistantMessage(pendingId, controller.signal.aborted ? copy.timeoutError : copy.genericError, "error", { retryRequest: snapshot });
    } finally {
      window.clearTimeout(timer);
      requestControllerRef.current = null;
      requestInFlightRef.current = false;
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const retryMessage = async (message: ChatMessage) => {
    if (!message.retryRequest || requestInFlightRef.current || retryWaitSeconds > 0) return;
    const snapshot = message.retryRequest;
    responseAnchorIdRef.current = null;
    followPendingRef.current = true;
    setMessages((current) => current.map((item) => item.id === message.id
      ? { ...item, content: copy.loading, status: "loading", retryRequest: undefined } : item));
    await handleChatRequest(snapshot, message.id);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <aside
      ref={shellRef}
      aria-label={copy.ariaLabel}
      className={cn(
        "assistant-bot-shell pointer-events-none",
        isSmallScreen && "assistant-bot-shell--mobile",
        isOpen &&
          !isExpanded &&
          "assistant-bot-shell--open fixed right-0 w-full max-w-none sm:right-4 sm:w-[calc(100vw-2rem)] sm:max-w-[440px] md:right-6",
        isOpen &&
          isExpanded &&
          "assistant-bot-shell--open assistant-bot-shell--expanded fixed inset-0 w-full max-w-none",
        !isOpen &&
          "assistant-bot-shell--closed fixed right-4 ml-auto w-[calc(100vw-2rem)] max-w-[440px] sm:mr-0 md:right-6",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            ref={launcherRef}
            key="assistant-launcher"
            type="button"
            onClick={() => {
              setLauncherPhase("settled");
              setIsOpen(true);
            }}
            className="group pointer-events-auto relative ml-auto flex cursor-pointer items-end rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            aria-label={copy.openLabel}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            style={{ transformOrigin: "100% 90%" }}
            initial={shouldPeek ? { opacity: 1, x: 100, rotate: 0 } : { opacity: 1, x: 0, rotate: 0 }}
            animate={shouldPeek
              ? { opacity: 1, x: [100, 65, 65, 0], rotate: [0, -9, -9, 0] }
              : { opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={shouldPeek
              ? { delay: 0.32, duration: 1.45, times: [0, 0.26, 0.6, 1], ease: [0.22, 0.68, 0.25, 1] }
              : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              setLauncherPhase("settled");
            }}
          >
            <span className="assistant-wolf-celestial" aria-hidden="true">
              <svg className="assistant-wolf-celestial__moon" viewBox="0 0 11 11" shapeRendering="crispEdges" focusable="false">
                <path d="M4 0h3v1H4zM2 1h7v1H2zM1 2h9v2H1zM0 4h11v3H0zM1 7h9v2H1zM2 9h7v1H2zM4 10h3v1H4z" />
              </svg>
            </span>
            {(launcherPhase === "settled" || reduceMotion) && (
              <span
                aria-hidden="true"
                className="assistant-launcher-bubble pointer-events-none absolute bottom-9 right-[calc(100%-0.15rem)] z-10 hidden w-max px-3 py-2 sm:block sm:max-w-52"
              >
                <span className="assistant-launcher-bubble__tail" />
                <span className="relative block text-xs font-normal leading-tight tracking-normal">
                  {copy.launcherBubble}
                </span>
              </span>
            )}
            <span className="control-hover relative inline-block rounded-2xl p-2">
              <PixelWolfAvatar />
            </span>
          </motion.button>
        ) : (
          <motion.div
            ref={setPanelElement}
            key="assistant-panel"
            role="dialog"
            aria-modal={isModal || undefined}
            aria-label={copy.title}
            className={cn(
              "assistant-panel pointer-events-auto relative flex w-full overflow-hidden overscroll-contain border backdrop-blur-2xl",
              isExpanded
                ? "rounded-none"
                : "rounded-b-none rounded-t-3xl sm:rounded-3xl",
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
                className="assistant-panel-header relative z-40 flex min-h-[4.75rem] shrink-0 items-center gap-3 border-b px-4 py-3"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 12%, var(--color-border))",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface) 46%, transparent)",
                }}
              >
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
                    ref={closeRef}
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
                onScroll={(event) => {
                  const container = event.currentTarget;
                  savedScrollTopRef.current = container.scrollTop;
                  if (!isSubmitting) return;
                  followPendingRef.current =
                    container.scrollHeight -
                      container.clientHeight -
                      container.scrollTop <=
                    64;
                }}
              >
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  const isLoading = message.status === "loading";
                  const reply = getReplyPresentation(message.content, message.details);

                  return (
                    <div
                      key={message.id}
                      data-chat-message-id={message.id}
                      className={cn(
                        "flex",
                        isUser ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "min-w-0 max-w-[88%] break-words rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed",
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
                          <>
                            <FormattedMessage content={message.status === "normal" ? reply.preview : message.content} />
                            {message.id === "welcome" ? <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>{copy.contactBoundary}</p> : null}
                            {message.status === "normal" && reply.details ? (
                              <details className="assistant-reply-details mt-3 border-t pt-2" style={{ borderColor: "var(--color-border)" }}>
                                <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]">{copy.moreDetails}</summary>
                                <FormattedMessage content={reply.details} />
                              </details>
                            ) : null}
                            {message.sources?.length ? (
                              <nav className="mt-3 border-t pt-2" style={{ borderColor: "var(--color-border)" }} aria-label={copy.evidenceLabel}>
                                <p className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>{copy.evidenceLabel}</p>
                                {message.sources.map((source) => (
                                  <a key={source.id} href={source.href} target="_blank" rel="noopener noreferrer"
                                    className="block min-h-11 break-words py-3 text-sm font-semibold underline decoration-1 underline-offset-4 outline-none hover:text-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
                                    aria-label={`${source.label} · ${copy.opensNewTab}`}>
                                    {source.label}
                                  </a>
                                ))}
                              </nav>
                            ) : null}
                            {message.status === "error" && message.retryRequest ? (
                              <div className="mt-3">
                                <p className="text-xs" style={{ color: "var(--color-muted)" }}>{copy.requestSaved}</p>
                                <button type="button" disabled={isSubmitting || retryWaitSeconds > 0}
                                  onClick={() => void retryMessage(message)}
                                  className="mt-2 min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                                  style={{ color: "var(--color-text)", borderColor: "var(--color-border)" }} aria-live="off">
                                  {retryWaitSeconds ? copy.retryWait.replace("{seconds}", String(retryWaitSeconds)) : copy.retryButton}
                                </button>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {suggestions.length > 0 && !isSubmitting ? (
                  <div
                    className="max-w-[88%] space-y-2 pb-2"
                    aria-label={
                      messages.length === 1
                        ? copy.suggestionsLabel
                        : copy.followUpLabel
                    }
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {messages.length === 1
                        ? copy.suggestionsLabel
                        : copy.followUpLabel}
                    </p>
                    <div className="grid gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            if (messages.length === 1) {
                              const intent = (["experience", "fit", "project"] as const)[index];
                              setComposerIntent(intent);
                              setInput((current) => !current.trim() || current === copy.experiencePrompt
                                ? intent === "experience" ? copy.experiencePrompt : "" : current);
                            } else {
                              setInput(suggestion);
                              setComposerIntent("general");
                            }
                            textareaRef.current?.focus();
                          }}
                          aria-pressed={messages.length === 1 ? composerIntent === (["experience", "fit", "project"] as const)[index] : undefined}
                          className="min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-snug transition-[background-color,border-color,color] duration-200 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-card-hover)]"
                          style={{
                            color: "var(--color-text-secondary)",
                            borderColor: messages.length === 1 && composerIntent === (["experience", "fit", "project"] as const)[index]
                              ? "var(--color-primary)" : "var(--color-border)",
                            backgroundColor: messages.length === 1 && composerIntent === (["experience", "fit", "project"] as const)[index]
                              ? "var(--color-card-hover)" : "color-mix(in srgb, var(--color-surface) 54%, transparent)",
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="assistant-composer-dock pointer-events-none relative shrink-0 px-4 pb-3">
                <div
                  className={cn(
                    "assistant-composer-avatar-row pointer-events-none mb-0 mr-5 flex justify-end",
                    isExpanded && "assistant-composer-avatar-row--expanded",
                  )}
                >
                  <PixelWolfAvatar
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
                    <div className="assistant-context-files mb-2 max-h-24 space-y-2 overflow-y-auto px-2 pt-1">
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
                      placeholder={composerPlaceholder}
                      rows={2}
                      maxLength={MAX_CHARS}
                      name="portfolio-assistant-question"
                      autoComplete="off"
                      aria-label={copy.inputLabel}
                      className="max-h-32 min-h-12 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-base sm:text-sm font-medium leading-relaxed outline-none focus:outline-none focus-visible:outline-none placeholder:text-[color:var(--color-muted)]"
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
                  {composerIntent === "fit" || composerIntent === "project" ? (
                    <p
                      className="px-2 pt-1 text-xs font-medium"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {composerIntent === "fit" ? copy.rolePasteHint : copy.projectHint}
                    </p>
                  ) : null}
                  <div
                    className="mt-1 flex items-center justify-between gap-3 px-2 text-xs font-semibold"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <span>{copy.privacyNote}</span>
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
