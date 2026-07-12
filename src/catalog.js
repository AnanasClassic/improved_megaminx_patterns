export const SECTIONS = [
  { prefix: "A", label: "Simple Patterns" },
  { prefix: "D", label: "Multi Color Patterns" },
  { prefix: "G", label: "Various Patterns" },
  { prefix: "I", label: "Face Axis (2 Colors)" },
  { prefix: "J", label: "Face Axis (3 Colors)" },
  { prefix: "K", label: "Face Axis (4 Colors)" },
  { prefix: "L", label: "Face Axis (5 Colors)" },
  { prefix: "N", label: "Multiple Rotation Axes" },
  { prefix: "P", label: "Snakes" },
  { prefix: "Q", label: "Multi Color Snakes" },
  { prefix: "U", label: "Flips and Twists" },
  { prefix: "V", label: "Invisible Patterns" }
];

const GROUP_LABELS = {
  A200: "Dot",
  A410: "U",
  A430: "C",
  A840: "Chessboard",
  A850: "Star",
  D830: "Blossom",
  D850: "Star",
  G200: "Donut",
  G710: "U Layer — Edge Swap",
  G720: "U Layer — Edge 3-Cycle",
  G725: "U Layer — Edge 5-Cycle",
  G735: "U Layer — Corner Twists",
  G750: "U Layer — Corner 3-Cycle",
  G755: "U Layer — Corner 5-Cycle",
  I580: "Smiley",
  I600: "Crown",
  I620: "Equator",
  I630: "Equator Bricks",
  I640: "Equator Corners",
  I645: "Equator Edges",
  I650: "Small Equator Bricks",
  I680: "Ties and Eiffel Towers",
  I720: "Short Arrow",
  I730: "Arrow",
  I760: "Anchor",
  J580: "Smiley",
  J600: "Crown",
  J630: "Dotted Equator Bricks",
  J640: "Dotted Equator",
  J650: "Dashed Equator",
  J675: "Dotted Ties",
  J680: "Eiffel Tower",
  K675: "Dotted Ties",
  K680: "Dotted Eiffel Tower",
  L680: "Eiffel Tower",
  N200: "Cubes in a Dodecahedron",
  N240: "Corner Triangle",
  N260: "Corner Ring",
  N300: "Small Edge Triangle",
  N340: "Big Edge Triangle",
  N400: "Edge Ring",
  N480: "Windmill",
  N490: "Peak",
  N500: "Propeller",
  N520: "Sea Star",
  N530: "Octopus",
  N600: "Brick",
  N700: "Peak",
  P300: "Snake",
  P700: "Border Snake (3 Faces)",
  P720: "Two Border Snakes",
  P740: "Border Snakes and Cubes",
  P800: "Border Snake (6 Faces)",
  P820: "Two Snakes (6 Faces)",
  Q300: "Multi Color Snake",
  Q320: "Speckled Snake",
  Q700: "Two Border Snakes",
  Q740: "Speckled Border Snakes",
  U060: "6 Edge Flips",
  U100: "10 Edge Flips",
  U120: "12 Edge Flips",
  U140: "14 Edge Flips",
  U180: "18 Edge Flips",
  U200: "20 Edge Flips",
  U220: "22 Edge Flips",
  U240: "24 Edge Flips",
  U280: "28 Edge Flips",
  U300: "Superflip",
  U500: "Corner Swaps",
  U510: "Corner Twists",
  U520: "Supertwist",
  V200: "Brick Flips",
  V500: "Superfliptwist"
};

export function sectionFor(pattern) {
  return SECTIONS.find((section) => section.prefix === pattern.code.slice(0, 1)) ?? SECTIONS[0];
}

export function groupKey(pattern) {
  return pattern.code.slice(0, 4);
}

export function groupLabel(pattern) {
  const key = groupKey(pattern);
  return GROUP_LABELS[key] ?? key;
}

export function groupPatterns(patterns, prefix) {
  const groups = new Map();

  for (const pattern of patterns) {
    if (pattern.code.slice(0, 1) !== prefix) continue;
    const key = groupKey(pattern);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(pattern);
  }

  return groups;
}

export function normalizeAlgorithm(value = "") {
  return value.trim().replace(/\s+/g, " ");
}

export function personalSolutionsMatch(pattern) {
  return normalizeAlgorithm(pattern.new_solution) === normalizeAlgorithm(pattern.minimal_ftm_solution);
}

export function comparisonFor(pattern) {
  const difference = Number(pattern.new_solution_length) - Number(pattern.old_solution_length);

  if (difference < 0) {
    return {
      state: "shorter",
      difference,
      label: `−${Math.abs(difference)} shorter`
    };
  }

  if (difference > 0) {
    return {
      state: "longer",
      difference,
      label: `+${difference} longer`
    };
  }

  return { state: "same", difference: 0, label: "same length" };
}

export function twizzleLink(algorithm, suppliedLink = "", setupAnchor = "") {
  if (suppliedLink) return suppliedLink;
  const url = new URL("https://alpha.twizzle.net/edit/");
  url.searchParams.set("alg", algorithm);
  url.searchParams.set("puzzle", "megaminx");
  if (setupAnchor) url.searchParams.set("setup-anchor", setupAnchor);
  return url.toString();
}

export function searchPatterns(patterns, query) {
  const terms = query
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!terms.length) return [];

  return patterns.filter((pattern) => {
    const haystack = `${pattern.code} ${pattern.name}`.toLocaleLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
