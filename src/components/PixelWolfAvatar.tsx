import type { CSSProperties } from "react";
import "./pixel-wolf.css";
import { cn } from "@/utils";
import {
  toPaths,
  WOLF_BODY,
  WOLF_COLUMNS,
  WOLF_FRAMES,
  WOLF_HEAD,
  WOLF_HEAD_GROOM,
  WOLF_HEAD_HOWL,
  WOLF_HEAD_LIFT,
  WOLF_PAW_REST,
  WOLF_PAW_LIFT,
  WOLF_PAW_GROOM,
  WOLF_ROWS,
  WOLF_TONGUE_SHORT,
  WOLF_TONGUE_TIP,
  type WolfPaint,
} from "@/lib/pixel-wolf-sprite";

const bodyPaths = toPaths(WOLF_BODY);
const headPaths = toPaths(WOLF_HEAD);
const headLiftPaths = toPaths(WOLF_HEAD_LIFT);
const headHowlPaths = toPaths(WOLF_HEAD_HOWL);
const headGroomPaths = toPaths(WOLF_HEAD_GROOM);
const pawRestPaths = toPaths(WOLF_PAW_REST);
const pawLiftPaths = toPaths(WOLF_PAW_LIFT);
const pawGroomPaths = toPaths(WOLF_PAW_GROOM);
const tongueShortPaths = toPaths(WOLF_TONGUE_SHORT);
const tongueTipPaths = toPaths(WOLF_TONGUE_TIP);
const tailFramePaths = Object.entries(WOLF_FRAMES)
  .filter(([name]) => name.startsWith("tail-"))
  .map(([name, layer]) => [name, toPaths(layer)] as const);
const earFramePaths = Object.entries(WOLF_FRAMES)
  .filter(([name]) => name.startsWith("ear-"))
  .map(([name, layer]) => [name, toPaths(layer)] as const);

// Grid proportions for globals.css, derived from the sprite itself.
const gridStyle = {
  "--pixel-wolf-columns": WOLF_COLUMNS,
  "--pixel-wolf-rows": WOLF_ROWS,
} as CSSProperties;

const renderPaths = (paths: [WolfPaint, string][]) =>
  paths.map(([paint, d]) => (
    <path key={paint} d={d} className={`pixel-wolf__paint--${paint}`} />
  ));

export default function PixelWolfAvatar({
  isThinking = false,
  size = "launcher",
}: {
  isThinking?: boolean;
  size?: "launcher" | "header" | "composer";
}) {
  return (
    <span
      className={cn(
        "pixel-assistant-avatar",
        `pixel-assistant-avatar--${size}`,
        isThinking && "pixel-assistant-avatar--thinking",
      )}
      style={gridStyle}
      aria-hidden="true"
    >
      <svg
        className="pixel-wolf__sprite"
        viewBox={`0 0 ${WOLF_COLUMNS} ${WOLF_ROWS}`}
        shapeRendering="crispEdges"
        focusable="false"
      >
        {renderPaths(bodyPaths)}
        {tailFramePaths.map(([name, paths]) => (
          <g key={name} className={`pixel-wolf__frame pixel-wolf__frame--${name}`}>
            {renderPaths(paths)}
          </g>
        ))}
        <g className="pixel-wolf__head">
          <g className="pixel-wolf__head-pose pixel-wolf__head-pose--rest">
            {renderPaths(headPaths)}
          </g>
          {size === "launcher" && (
            <>
              <g className="pixel-wolf__head-pose pixel-wolf__head-pose--lift" opacity="0">
                {renderPaths(headLiftPaths)}
              </g>
              <g className="pixel-wolf__head-pose pixel-wolf__head-pose--howl" opacity="0">
                {renderPaths(headHowlPaths)}
              </g>
              <g className="pixel-wolf__head-pose pixel-wolf__head-pose--groom" opacity="0">
                {renderPaths(headGroomPaths)}
              </g>
            </>
          )}
          {earFramePaths.map(([name, paths]) => (
            <g key={name} className={`pixel-wolf__frame pixel-wolf__frame--${name}`}>
              {renderPaths(paths)}
            </g>
          ))}
        </g>
        <g className="pixel-wolf__paw-rest">{renderPaths(pawRestPaths)}</g>
        {size === "launcher" && (
          <>
            <g className="pixel-wolf__paw-lift" opacity="0">{renderPaths(pawLiftPaths)}</g>
            <g className="pixel-wolf__paw-groom" opacity="0">{renderPaths(pawGroomPaths)}</g>
            <g className="pixel-wolf__tongue-short" opacity="0">{renderPaths(tongueShortPaths)}</g>
            <g className="pixel-wolf__tongue-tip" opacity="0">{renderPaths(tongueTipPaths)}</g>
          </>
        )}
      </svg>
      <span className="pixel-wolf__shadow" />
    </span>
  );
}
