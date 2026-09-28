// 8-bit wolf used as the portfolio assistant avatar. Kept import-free so
// scripts/test-pixel-wolf-sprite.mjs can load it without the Next.js toolchain.
//
// Legend: O body · W muzzle/chest · U tail tip · S nose · M ears/crown/ruff
// (pulses) · T tail (pulses) · E eyes (blink).

export type SpriteLayer = { y?: number; rows: readonly string[] };
export type WolfPaint = "body" | "muzzle" | "shadow" | "mark" | "eye";
export type WolfFrameName = keyof typeof WOLF_FRAMES;

export const WOLF_COLUMNS = 16;
export const WOLF_ROWS = 13;

// Everything that never moves. The right ear and the tail live in WOLF_FRAMES.
export const WOLF_BASE: SpriteLayer = {
  rows: [
    "..M.............",
    "..MM............",
    "..MWM...........",
    ".MOOOMMMOOOM....",
    ".OOOOOOOOOOO....",
    ".OOEOOOOOEOO....",
    "MOOOOWWWOOOOM...",
    "MMOOWWSWWOOMM...",
    ".MMOWWWWWOMM....",
    "..OOOOOOOOO.....",
    "..OOOWWWOOO.....",
    "..OOOWWWOOO.....",
    "..OO.O.O.OO.....",
  ],
};

// Frame-by-frame poses; globals.css decides which one is visible over time.
export const WOLF_FRAMES = {
  "ear-rest": {
    rows: ["..........M.....", ".........MM.....", "........MWM....."],
  },
  "ear-twitch": {
    rows: ["................", ".........MMM....", "........MWM....."],
  },
  "tail-up": {
    y: 5,
    rows: [
      "..............U.",
      ".............TT.",
      ".............TTT",
      ".............TT.",
      "............TT..",
      "............TT..",
      "...........TT...",
    ],
  },
  "tail-mid": {
    y: 6,
    rows: [
      "..............U.",
      ".............TT.",
      ".............TTT",
      ".............TT.",
      "............TT..",
      "...........TT...",
    ],
  },
  "tail-down": {
    y: 7,
    rows: [
      "...............U",
      "..............TT",
      ".............TTT",
      "............TTT.",
      "...........TTT..",
    ],
  },
} as const satisfies Record<string, SpriteLayer>;

export const PAINT_BY_TOKEN: Record<string, WolfPaint> = {
  O: "body",
  W: "muzzle",
  U: "muzzle",
  S: "shadow",
  M: "mark",
  T: "mark",
  E: "eye",
};

// One SVG path per paint, built from horizontal runs so a layer is a handful
// of elements instead of one node per pixel.
export const toPaths = ({ y = 0, rows }: SpriteLayer) => {
  const paths: Partial<Record<WolfPaint, string>> = {};

  rows.forEach((row, rowIndex) => {
    let x = 0;
    while (x < row.length) {
      const paint = PAINT_BY_TOKEN[row[x]];
      let end = x + 1;
      while (paint && end < row.length && PAINT_BY_TOKEN[row[end]] === paint) {
        end += 1;
      }
      if (paint) {
        paths[paint] = `${paths[paint] ?? ""}M${x} ${y + rowIndex}h${end - x}v1h${x - end}z`;
      }
      x = end;
    }
  });

  return Object.entries(paths) as [WolfPaint, string][];
};
