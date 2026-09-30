// 8-bit wolf used as the portfolio assistant avatar. Kept import-free so
// scripts/test-pixel-wolf-sprite.mjs can load it without the Next.js toolchain.
//
// Legend: O body · W muzzle/chest · U tail tip · S nose · M ears/crown/ruff
// (pulses) · T tail (pulses) · E eyes (blink) · P tongue (grooming only).

export type SpriteLayer = { y?: number; rows: readonly string[] };
export type WolfPaint = "body" | "muzzle" | "shadow" | "mark" | "eye" | "tongue";
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

// Split only at render time so the head and one forepaw can move independently.
// The hidden neck pixel row bridges the head lift without changing the rest pose.
export const WOLF_HEAD: SpriteLayer = { rows: WOLF_BASE.rows.slice(0, 10) };
export const WOLF_BODY: SpriteLayer = {
  y: 9,
  rows: [
    "...OOOOOOO......",
    ...WOLF_BASE.rows.slice(10).map((row) => `${row.slice(0, 2)}..${row.slice(4)}`),
  ],
};

// Looking skyward is a change of face perspective, not just a translated head:
// the nose climbs above the eyes, the eyes narrow and the mouth opens below it.
export const WOLF_HEAD_LIFT: SpriteLayer = {
  rows: [
    ...WOLF_HEAD.rows.slice(0, 6),
    "MOOOOWSSOOOOM...",
    "MMOOWWSSWOOMM...",
    ...WOLF_HEAD.rows.slice(8),
  ],
};

export const WOLF_HEAD_HOWL: SpriteLayer = {
  rows: [
    ...WOLF_HEAD.rows.slice(0, 4),
    ".OOOOWSSWOOO....",
    ".OOSOWWWWSOO....",
    "MOOOOWSSOOOOM...",
    "MMOOWWSSWOOMM...",
    ...WOLF_HEAD.rows.slice(8),
  ],
};

// The gaze and nose move down toward the raised viewer-left forepaw. Keep the
// frontal silhouette; grooming is a small face change, not a floating head.
export const WOLF_HEAD_GROOM: SpriteLayer = {
  rows: [
    ...WOLF_HEAD.rows.slice(0, 5),
    ".OOOOOOOOOOO....",
    "MOOEOOOOEOOOM...",
    "MMOOWWWWWOOMM...",
    ".MMOWSWWWOMM....",
    "..OOOWWOOOO.....",
  ],
};

export const WOLF_PAW_REST: SpriteLayer = {
  y: 10,
  rows: ["..OO............", "..OO............", "..OO............"],
};

export const WOLF_PAW_LIFT: SpriteLayer = {
  y: 10,
  rows: ["..OOWM..........", "..OOM..........."],
};

export const WOLF_PAW_GROOM: SpriteLayer = {
  y: 9,
  rows: ["..MWWM..........", "..OOWM..........", "..OOM..........."],
};

// The short tongue reaches the paw, then its tip sweeps over the pad. Both
// segments retract between licks; there is no ambient panting/tongue waving.
export const WOLF_TONGUE_SHORT: SpriteLayer = {
  y: 9,
  rows: ["....P..........."],
};

export const WOLF_TONGUE_TIP: SpriteLayer = {
  y: 10,
  rows: ["....P..........."],
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
  P: "tongue",
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
