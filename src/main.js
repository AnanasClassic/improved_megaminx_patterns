import { TwistyPlayer } from "cubing/twisty";
import "./styles.css";

import {
  SECTIONS,
  comparisonFor,
  groupLabel,
  groupPatterns,
  personalSolutionsMatch,
  searchPatterns,
  sectionFor,
  twizzleLink
} from "./catalog.js";

const elements = {
  breadcrumb: document.querySelector("#breadcrumb"),
  comparisonBadge: document.querySelector("#comparison-badge"),
  content: document.querySelector("#pattern-content"),
  count: document.querySelector("#pattern-count"),
  loading: document.querySelector("#loading-state"),
  mobileBackdrop: document.querySelector("#mobile-backdrop"),
  navClose: document.querySelector("#nav-close"),
  navToggle: document.querySelector("#nav-toggle"),
  next: document.querySelector("#next-pattern"),
  patternNav: document.querySelector("#pattern-nav"),
  patternPosition: document.querySelector("#pattern-position"),
  playerMount: document.querySelector("#player-mount"),
  previewCode: document.querySelector("#preview-code"),
  previous: document.querySelector("#previous-pattern"),
  search: document.querySelector("#pattern-search"),
  searchForm: document.querySelector("#search-form"),
  sectionNav: document.querySelector("#section-nav"),
  sidebar: document.querySelector("#sidebar"),
  solutions: document.querySelector("#solutions"),
  title: document.querySelector("#pattern-title")
};

const state = {
  patterns: [],
  patternByCode: new Map(),
  activePattern: null,
  activeSection: "A",
  player: null,
  query: ""
};

const PERSONAL_SOLUTION_META = "Vladislav Kuznetsov · 12 July 2026";

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makePlayer() {
  const player = new TwistyPlayer({
    puzzle: "megaminx",
    visualization: "3D",
    hintFacelets: "none",
    backView: "none",
    background: "none",
    controlPanel: "bottom-row",
    viewerLink: "twizzle",
    cameraDistance: 4.8,
    tempoScale: 2,
    experimentalSetupAnchor: "start"
  });

  player.setAttribute("experimental-drag-input", "auto");
  player.setAttribute("experimental-stickering", "full");
  player.setAttribute("aria-label", "Interactive Megaminx pattern");
  return player;
}

function updatePlayer(pattern) {
  if (!state.player) {
    state.player = makePlayer();
    elements.playerMount.replaceChildren(state.player);
  }

  state.player.alg = pattern.new_solution;
  state.player.jumpToStart();
}

function renderSectionNav() {
  const fragment = document.createDocumentFragment();

  for (const section of SECTIONS) {
    const button = createElement("button", "section-link");
    button.type = "button";
    button.dataset.prefix = section.prefix;
    button.textContent = section.label;

    if (section.prefix === state.activeSection) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "true");
    }

    button.addEventListener("click", () => {
      state.query = "";
      elements.search.value = "";
      const firstPattern = state.patterns.find((pattern) => pattern.code.startsWith(section.prefix));
      if (firstPattern) selectPattern(firstPattern.code, { pushHistory: true });
    });
    fragment.append(button);
  }

  elements.sectionNav.replaceChildren(fragment);
}

function makePatternLink(pattern) {
  const button = createElement("button", "pattern-link");
  button.type = "button";
  button.dataset.code = pattern.code;
  button.title = pattern.name;

  const name = createElement("span", "pattern-link-name", pattern.name);
  const code = createElement("span", "pattern-link-code", pattern.code);
  button.append(name, code);

  if (pattern.code === state.activePattern?.code) {
    button.classList.add("is-active");
    button.setAttribute("aria-current", "page");
  }

  button.addEventListener("click", () => selectPattern(pattern.code, { pushHistory: true, focusContent: true }));
  return button;
}

function renderSearchResults(results) {
  const heading = createElement("div", "pattern-nav-heading");
  heading.append(
    createElement("span", "pattern-nav-title", "Search results"),
    createElement("span", "pattern-nav-count", String(results.length))
  );

  const fragment = document.createDocumentFragment();
  fragment.append(heading);

  if (!results.length) {
    const empty = createElement("div", "empty-search");
    empty.append(
      createElement("strong", "", "No matching patterns"),
      createElement("span", "", "Try a name such as “star” or a code such as “A850”.")
    );
    fragment.append(empty);
  } else {
    const list = createElement("div", "pattern-list search-result-list");
    for (const pattern of results) list.append(makePatternLink(pattern));
    fragment.append(list);
  }

  elements.patternNav.replaceChildren(fragment);
}

function renderPatternNav() {
  if (state.query) {
    renderSearchResults(searchPatterns(state.patterns, state.query));
    return;
  }

  const section = SECTIONS.find(({ prefix }) => prefix === state.activeSection);
  const heading = createElement("div", "pattern-nav-heading");
  heading.append(
    createElement("span", "pattern-nav-title", section?.label ?? "Patterns"),
    createElement(
      "span",
      "pattern-nav-count",
      String(state.patterns.filter((pattern) => pattern.code.startsWith(state.activeSection)).length)
    )
  );

  const fragment = document.createDocumentFragment();
  fragment.append(heading);

  const groups = groupPatterns(state.patterns, state.activeSection);
  for (const [key, patterns] of groups) {
    const details = createElement("details", "pattern-group");
    details.open = patterns.some((pattern) => pattern.code === state.activePattern?.code);

    const summary = createElement("summary", "pattern-group-title");
    summary.append(
      createElement("span", "", groupLabel(patterns[0])),
      createElement("span", "group-count", String(patterns.length))
    );

    const list = createElement("div", "pattern-list");
    list.dataset.group = key;
    for (const pattern of patterns) list.append(makePatternLink(pattern));
    details.append(summary, list);
    fragment.append(details);
  }

  elements.patternNav.replaceChildren(fragment);
}

function solutionHeader(label, lengthLabel, variant = "") {
  const header = createElement("div", "solution-heading");
  const title = createElement("h2", "", label);
  const length = createElement("span", `solution-length ${variant}`.trim(), lengthLabel);
  header.append(title, length);
  return header;
}

function solutionLink(url) {
  const link = createElement("a", "twizzle-link", "Open in Alpha Twizzle");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function solutionBlock({ label, length, algorithm, meta, link, variant }) {
  const section = createElement("section", "solution-block");
  if (variant) section.dataset.variant = variant;
  section.append(solutionHeader(label, length, variant));

  if (meta) section.append(createElement("div", "solution-meta", meta));

  const algorithmElement = createElement("code", "algorithm", algorithm);
  const actions = createElement("div", "solution-actions");
  actions.append(solutionLink(link));
  section.append(algorithmElement, actions);
  return section;
}

function renderSolutions(pattern) {
  const fragment = document.createDocumentFragment();
  const authorAndDate = [pattern.old_solution_author, pattern.old_solution_date].filter(Boolean).join(" · ");

  fragment.append(
    solutionBlock({
      label: "Previous best",
      length: `${pattern.old_solution_length} BTM`,
      algorithm: pattern.old_solution,
      meta: authorAndDate,
      link: pattern.old_alpha_twizzle_link || twizzleLink(pattern.old_solution),
      variant: "previous"
    })
  );

  if (personalSolutionsMatch(pattern)) {
    const length = pattern.new_solution_length === pattern.minimal_ftm_solution_length
      ? `${pattern.new_solution_length} BTM · best FTM`
      : `${pattern.new_solution_length} BTM · ${pattern.minimal_ftm_solution_length} FTM`;

    fragment.append(
      solutionBlock({
        label: "My best · Best FTM",
        length,
        algorithm: pattern.new_solution,
        meta: PERSONAL_SOLUTION_META,
        link: twizzleLink(pattern.new_solution, pattern.alpha_twizzle_link),
        variant: "personal"
      })
    );
  } else {
    fragment.append(
      solutionBlock({
        label: "My best",
        length: `${pattern.new_solution_length} BTM`,
        algorithm: pattern.new_solution,
        meta: PERSONAL_SOLUTION_META,
        link: twizzleLink(pattern.new_solution, pattern.alpha_twizzle_link),
        variant: "personal"
      }),
      solutionBlock({
        label: "My best FTM",
        length: `${pattern.minimal_ftm_solution_length} FTM`,
        algorithm: pattern.minimal_ftm_solution,
        meta: PERSONAL_SOLUTION_META,
        link: twizzleLink(pattern.minimal_ftm_solution, pattern.minimal_ftm_alpha_twizzle_link),
        variant: "ftm"
      })
    );
  }

  elements.solutions.replaceChildren(fragment);
}

function updatePager(pattern) {
  const index = state.patterns.findIndex(({ code }) => code === pattern.code);
  elements.patternPosition.textContent = `${index + 1} / ${state.patterns.length}`;
  elements.previous.disabled = index <= 0;
  elements.next.disabled = index >= state.patterns.length - 1;
  elements.previous.dataset.target = state.patterns[index - 1]?.code ?? "";
  elements.next.dataset.target = state.patterns[index + 1]?.code ?? "";
}

function updateUrl(code, replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.set("pattern", code);
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ pattern: code }, "", url);
}

function renderPattern(pattern) {
  const section = sectionFor(pattern);
  const comparison = comparisonFor(pattern);

  state.activePattern = pattern;
  state.activeSection = section.prefix;

  elements.title.textContent = pattern.name;
  elements.previewCode.textContent = pattern.code;
  elements.breadcrumb.textContent = `${section.label} / ${groupLabel(pattern)} / ${pattern.code}`;
  elements.comparisonBadge.textContent = comparison.label;
  elements.comparisonBadge.dataset.state = comparison.state;
  elements.comparisonBadge.setAttribute(
    "aria-label",
    `My best solution is ${comparison.label} than the previous best`.replace("same length than", "the same length as")
  );

  document.title = `${pattern.name} · Megaminx Patterns`;
  renderSectionNav();
  renderPatternNav();
  renderSolutions(pattern);
  updatePlayer(pattern);
  updatePager(pattern);
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  elements.navToggle.setAttribute("aria-expanded", "false");
  elements.mobileBackdrop.hidden = true;
}

function selectPattern(code, options = {}) {
  const pattern = state.patternByCode.get(code);
  if (!pattern) return;

  renderPattern(pattern);
  if (options.pushHistory) updateUrl(code);
  closeMobileNav();

  if (options.focusContent && window.matchMedia("(max-width: 760px)").matches) {
    elements.content.focus({ preventScroll: true });
    elements.content.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initialCode() {
  const requested = new URL(window.location.href).searchParams.get("pattern");
  return state.patternByCode.has(requested) ? requested : state.patterns[0]?.code;
}

async function initialize() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}patterns.json`);
    if (!response.ok) throw new Error(`Could not load patterns (${response.status})`);

    state.patterns = await response.json();
    state.patternByCode = new Map(state.patterns.map((pattern) => [pattern.code, pattern]));
    elements.count.textContent = String(state.patterns.length);

    const code = initialCode();
    selectPattern(code);
    updateUrl(code, true);
    elements.loading.hidden = true;
    elements.content.hidden = false;
  } catch (error) {
    console.error(error);
    elements.loading.classList.add("is-error");
    elements.loading.textContent = "The pattern collection could not be loaded. Please refresh the page.";
  }
}

elements.searchForm.addEventListener("submit", (event) => event.preventDefault());
elements.search.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderPatternNav();
});

elements.search.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    elements.search.value = "";
    state.query = "";
    renderPatternNav();
    elements.search.blur();
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    elements.search.focus();
  }
});

elements.previous.addEventListener("click", () => selectPattern(elements.previous.dataset.target, { pushHistory: true }));
elements.next.addEventListener("click", () => selectPattern(elements.next.dataset.target, { pushHistory: true }));

elements.navToggle.addEventListener("click", () => {
  document.body.classList.add("nav-open");
  elements.navToggle.setAttribute("aria-expanded", "true");
  elements.mobileBackdrop.hidden = false;
});

elements.navClose.addEventListener("click", closeMobileNav);
elements.mobileBackdrop.addEventListener("click", closeMobileNav);

window.addEventListener("popstate", () => {
  const code = new URL(window.location.href).searchParams.get("pattern");
  if (state.patternByCode.has(code)) selectPattern(code);
});

initialize();
