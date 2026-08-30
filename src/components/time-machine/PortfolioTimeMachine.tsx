"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  TbArrowLeft,
  TbArrowRight,
  TbExternalLink,
  TbX,
} from "react-icons/tb";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  getPortfolioEraUrl,
  PORTFOLIO_ERAS,
  type PortfolioEra,
} from "@/data/portfolio-eras";
import styles from "./PortfolioTimeMachine.module.css";

interface PortfolioTimeMachineProps {
  lang: Locale;
  dictionary: Dictionary;
}

interface ArchivePreviewProps {
  era: PortfolioEra;
  lang: Locale;
  copy: Dictionary["timeMachine"];
}

const CURRENT_ERA_INDEX = PORTFOLIO_ERAS.length - 1;

function TimeMachineIcon() {
  return (
    <svg
      className={styles.timeMachineIcon}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        className={styles.machineHousing}
        d="M7.25 13.25H5.5v4h1.75M24.75 13.25h1.75v4h-1.75"
      />
      <circle className={styles.machineDial} cx="16" cy="14.75" r="9" />
      <path
        className={styles.machineOrbit}
        d="M10.2 10.1a7.45 7.45 0 0 1 10.95-.15M21.8 19.4a7.45 7.45 0 0 1-10.95.15"
      />
      <path
        className={styles.machineHand}
        d="M16 14.75V9.8M16 14.75l3.45 2.35"
      />
      <circle className={styles.machinePin} cx="16" cy="14.75" r="1.35" />
      <path
        className={styles.machineBase}
        d="M11.5 23.1v3.15M20.5 23.1v3.15M9.5 26.5h13"
      />
      <circle className={styles.machineSignal} cx="11.2" cy="6.7" r="1" />
      <circle className={styles.machineSignal} cx="20.8" cy="6.7" r="1" />
    </svg>
  );
}

function ArchivePreview({ era, lang, copy }: ArchivePreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const url = getPortfolioEraUrl(era, lang);
  const sourceLabel =
    era.source.kind === "current"
      ? copy.currentSource
      : `${copy.originalSource} · ${era.source.commit}`;

  useEffect(() => {
    setLoaded(false);
  }, [url]);

  return (
    <div className={styles.browserFrame}>
      <div className={styles.browserBar}>
        <div className={styles.browserLights} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>{sourceLabel}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${copy.openFullLabel}: ${era.name[lang]}`}
        >
          <TbExternalLink aria-hidden="true" />
          <span>{copy.openFull}</span>
        </a>
      </div>
      <div className={styles.frameViewport}>
        <AnimatePresence>
          {!loaded && (
            <motion.div
              className={styles.frameLoader}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
            >
              <i aria-hidden="true" />
              <span>{copy.loadingOriginal}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <iframe
          key={url}
          src={url}
          title={`${copy.previewLabel}: ${era.name[lang]}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

export default function PortfolioTimeMachine({
  lang,
  dictionary,
}: PortfolioTimeMachineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(CURRENT_ERA_INDEX);
  const [direction, setDirection] = useState(0);
  const reduceMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedTimelineRef = useRef<HTMLButtonElement>(null);
  const copy = dictionary.timeMachine;
  const selectedEra = PORTFOLIO_ERAS[selectedIndex];

  const selectEra = useCallback((index: number) => {
    if (index < 0 || index >= PORTFOLIO_ERAS.length) return;
    setSelectedIndex((current) => {
      setDirection(index === current ? 0 : index > current ? 1 : -1);
      return index;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const open = () => {
    setSelectedIndex(CURRENT_ERA_INDEX);
    setDirection(0);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectEra(Math.max(0, selectedIndex - 1));
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        selectEra(Math.min(PORTFOLIO_ERAS.length - 1, selectedIndex + 1));
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen, selectEra, selectedIndex]);

  useEffect(() => {
    if (!isOpen || !selectedTimelineRef.current || !timelineRef.current) return;
    const button = selectedTimelineRef.current;
    const rail = timelineRef.current;
    rail.scrollTo({
      left: button.offsetLeft - rail.clientWidth / 2 + button.clientWidth / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [isOpen, reduceMotion, selectedIndex]);

  const previewVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (travelDirection: number) => ({
          opacity: 0,
          x: travelDirection >= 0 ? "10%" : "-10%",
          rotateY: travelDirection >= 0 ? -7 : 7,
          scale: 0.975,
          filter: "blur(14px) saturate(0.7)",
          clipPath:
            travelDirection >= 0
              ? "inset(0 0 0 100% round 20px)"
              : "inset(0 100% 0 0 round 20px)",
        }),
        center: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px) saturate(1)",
          clipPath: "inset(0 0 0 0 round 0px)",
        },
        exit: (travelDirection: number) => ({
          opacity: 0,
          x: travelDirection >= 0 ? "-7%" : "7%",
          rotateY: travelDirection >= 0 ? 5 : -5,
          scale: 1.015,
          filter: "blur(10px) saturate(0.75)",
          clipPath:
            travelDirection >= 0
              ? "inset(0 100% 0 0 round 20px)"
              : "inset(0 0 0 100% round 20px)",
        }),
      };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={styles.launcher}
        onClick={open}
        aria-label={copy.openLabel}
        data-label={copy.launcher}
        title={copy.launcher}
      >
        <TimeMachineIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="time-machine-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
          >
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            <motion.section
              className={styles.machine}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18, scale: 0.99 }
              }
              transition={{
                duration: reduceMotion ? 0.01 : 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <header className={styles.machineHeader}>
                <div className={styles.machineTitle}>
                  <TimeMachineIcon />
                  <div>
                    <h2 id="time-machine-title">{copy.title}</h2>
                    <p>{copy.description}</p>
                  </div>
                </div>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    onClick={() => selectEra(selectedIndex - 1)}
                    disabled={selectedIndex === 0}
                    aria-label={copy.previousLabel}
                  >
                    <TbArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectEra(selectedIndex + 1)}
                    disabled={selectedIndex === CURRENT_ERA_INDEX}
                    aria-label={copy.nextLabel}
                  >
                    <TbArrowRight aria-hidden="true" />
                  </button>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label={copy.closeLabel}
                  >
                    <TbX aria-hidden="true" />
                  </button>
                </div>
              </header>

              <div className={styles.stageShell}>
                <div className={styles.eraContext}>
                  <div className={styles.eraIdentity}>
                    <h3>{selectedEra.name[lang]}</h3>
                    <div className={styles.eraDate}>
                      <span>{selectedEra.date[lang]}</span>
                      {selectedEra.id === "2026" && <b>{copy.current}</b>}
                    </div>
                  </div>
                  <p>{selectedEra.note[lang]}</p>
                  <ul aria-label={copy.stackLabel}>
                    {selectedEra.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div
                  className={styles.stage}
                  style={
                    { "--era-accent": selectedEra.accent } as React.CSSProperties
                  }
                >
                  <AnimatePresence initial={false} custom={direction} mode="sync">
                    <motion.div
                      key={selectedEra.id}
                      className={styles.previewLayer}
                      custom={direction}
                      variants={previewVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: reduceMotion ? 0.01 : 0.72,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <ArchivePreview
                        era={selectedEra}
                        lang={lang}
                        copy={copy}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence initial={false}>
                    <motion.div
                      key={`year-${selectedEra.id}`}
                      className={styles.yearFlash}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 1.16,
                              filter: "blur(12px)",
                            }
                      }
                      animate={
                        reduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: [0, 0.62, 0],
                              scale: [1.16, 1, 0.92],
                              filter: [
                                "blur(12px)",
                                "blur(0px)",
                                "blur(4px)",
                              ],
                            }
                      }
                      transition={{
                        duration: 0.82,
                        times: [0, 0.4, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      aria-hidden="true"
                    >
                      {selectedEra.year}
                    </motion.div>
                  </AnimatePresence>
                  {!reduceMotion && (
                    <motion.div
                      key={`scan-${selectedEra.id}`}
                      className={styles.scanLine}
                      initial={{ x: direction >= 0 ? "-110%" : "110%" }}
                      animate={{ x: direction >= 0 ? "110%" : "-110%" }}
                      transition={{
                        duration: 0.78,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  )}
                </div>
              </div>

              <footer className={styles.timeline}>
                <p>{copy.instructions}</p>
                <div
                  ref={timelineRef}
                  className={styles.timelineRail}
                  role="group"
                  aria-label={copy.timelineLabel}
                >
                  <span className={styles.railLine} aria-hidden="true" />
                  {PORTFOLIO_ERAS.map((era, index) => {
                    const selected = index === selectedIndex;
                    return (
                      <button
                        ref={selected ? selectedTimelineRef : undefined}
                        key={era.id}
                        type="button"
                        className={
                          selected ? styles.timelineSelected : undefined
                        }
                        onClick={() => selectEra(index)}
                        aria-current={selected ? "step" : undefined}
                        aria-label={`${copy.eraLabel} ${era.date[lang]}: ${era.name[lang]}`}
                      >
                        <i aria-hidden="true" />
                        <span>{era.timelineLabel[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </footer>

              <p className={styles.srOnly} aria-live="polite">
                {selectedEra.date[lang]}. {selectedEra.name[lang]}.{" "}
                {selectedEra.note[lang]}
              </p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
