import { letters, compose, decompose, layoutFor, vowelParts } from "./hangul.js";

const copy = {
  en: {
    skip: "Skip to the builder", navLab: "Playground", navGuide: "Field guide",
    edition: "A guide to Hangul", hero1: "How Hangul", hero2: "fits together.",
    intro: "Hangul letters share a single block. Change the vowel and the whole arrangement shifts.",
    cta: "Open in the builder", art: "Syllable structure", heroLabel: "Compare syllable layouts",
    sampleSide: "Side by side", sampleStacked: "Stacked", sampleMixed: "Combined",
    heroNotes: ["ㅏ goes to the right of ㅎ. ㄴ fits underneath both.", "ㅜ goes below ㅁ. ㄹ sits on the bottom row.", "ㅗ and ㅏ combine as ㅘ, wrapping below and to the right of ㄱ."],
    labTag: "01 / THE PLAYGROUND", labTitle: "Build a block.",
    labDesc: "Choose an initial, a vowel, and an optional final. Watch the block take shape as you change its parts.",
    specimen: "LIVE SPECIMEN", parts: "Parts", whole: "Syllable", viewLabel: "Specimen view",
    result: "YOUR SYLLABLE", copy: "Copy syllable", copied: "Copied ✓",
    copyError: "Copy unavailable", reset: "Reset", try: "TRY A SAMPLE",
    groups: ["Initial consonant", "Vowel", "Final consonant"],
    none: "No final consonant", side: "SIDE BY SIDE", stacked: "STACKED", mixed: "COMBINED",
    guideTag: "02 / FIELD GUIDE", guideTitle: "Same rules.\nDifferent shapes.",
    guideDesc: "The shape of the vowel changes where the letters sit. Compare these three arrangements, then try each one in the playground.",
    examples: [
      ["Side by side", "A vertical vowel like ㅏ sits to the right of the initial. The final, if present, goes below."],
      ["Stacked", "A horizontal vowel like ㅜ sits below the initial. Add a final consonant to make a third row."],
      ["Combined", "A vowel like ㅘ wraps under and to the right of the initial, combining ㅗ and ㅏ."],
    ],
    use: "Try in the builder ↗", footer: "An interactive study of the Korean alphabet.",
    reference: "Unicode reference ↗", top: "Back to top ↑", main: "Main",
  },
  ko: {
    skip: "음절 조합기로 건너뛰기", navLab: "놀이터", navGuide: "구조 안내",
    edition: "한글 구조 안내", hero1: "한글은 어떻게", hero2: "모일까요?",
    intro: "한글의 자모는 한 칸 안에 모여 한 글자를 이뤄요. 중성이 바뀌면 자모의 자리도 달라져요.",
    cta: "직접 조합해 보기", art: "음절의 구조", heroLabel: "음절 배치 비교",
    sampleSide: "좌우 배치", sampleStacked: "상하 배치", sampleMixed: "혼합 배치",
    heroNotes: ["ㅏ는 ㅎ의 오른쪽에 놓이고, 받침 ㄴ은 두 자모 아래에 놓여요.", "ㅜ는 ㅁ 아래에 놓이고, 받침 ㄹ은 맨 아래에 놓여요.", "ㅗ와 ㅏ가 합쳐진 ㅘ는 ㄱ의 아래와 오른쪽에 걸쳐 놓여요."],
    labTag: "01 / 한글 놀이터", labTitle: "한 글자 만들기.",
    labDesc: "초성과 중성을 고르고, 원하면 종성도 더해 보세요. 어떤 자모를 고르느냐에 따라 글자의 모양이 달라져요.",
    specimen: "실시간 조합", parts: "자모", whole: "완성 글자", viewLabel: "글자 보기 방식",
    result: "만든 글자", copy: "글자 복사", copied: "복사 완료 ✓",
    copyError: "복사할 수 없어요", reset: "초기화", try: "예시 선택",
    groups: ["초성", "중성", "종성"],
    none: "받침 없음", side: "좌우 배치", stacked: "상하 배치", mixed: "혼합 배치",
    guideTag: "02 / 구조 안내", guideTitle: "같은 규칙,\n다른 모양.",
    guideDesc: "중성의 모양에 따라 자모의 위치가 달라져요. 세 가지 배치를 비교하고 놀이터에서 직접 만들어 보세요.",
    examples: [
      ["좌우 배치", "ㅏ처럼 세로로 긴 중성은 초성의 오른쪽에 놓여요. 받침이 있으면 아래에 붙어요."],
      ["상하 배치", "ㅜ처럼 가로로 긴 중성은 초성 아래에 놓여요. 받침을 더하면 한 줄이 아래에 더 생겨요."],
      ["혼합 배치", "ㅘ는 ㅗ와 ㅏ가 합쳐진 중성이에요. 초성의 아래와 오른쪽에 걸쳐 놓여요."],
    ],
    use: "놀이터에서 만들어 보기 ↗", footer: "한글의 구조를 직접 탐구하는 놀이터.",
    reference: "유니코드 참고 자료 ↗", top: "맨 위로 ↑", main: "주 메뉴",
  },
};
const $ = (id) => document.getElementById(id);
const samples = ["한", "글", "봄", "물", "과", "나"];
const examples = ["한", "물", "과"];
const heroLabels = ["sampleSide", "sampleStacked", "sampleMixed"];
let heroSample = "한";
const colors = ["var(--lavender)", "var(--lime)", "var(--blue)"];
const url = new URL(location.href);
let language = url.searchParams.get("lang") === "ko" ? "ko" : "en";
let selection = decompose(url.searchParams.get("s")) ?? decompose("한");
let wholeView = false;
let copyTimer;
let copyRequest = 0;

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  if (tag === "button") node.type = "button";
  return node;
}

const groups = letters.map((group, groupIndex) => {
  const field = make("fieldset");
  field.style.setProperty("--accent", colors[groupIndex]);
  const legend = make("legend");
  const index = make("span", "idx", "0" + (groupIndex + 1));
  const label = make("span");
  legend.append(index, label);
  const grid = make("div", "key-grid");
  const buttons = group.map((letter, letterIndex) => {
    const button = make("button", "", letter || "—");
    if (letter) button.lang = "ko";
    button.addEventListener("click", () => {
      selection[groupIndex] = letterIndex;
      render();
    });
    button.addEventListener("keydown", (event) => {
      const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
      if (!Object.hasOwn(offsets, event.key) && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? group.length - 1 :
        Math.max(0, Math.min(group.length - 1, letterIndex + offsets[event.key]));
      buttons.forEach((key, i) => { key.tabIndex = i === next ? 0 : -1; });
      buttons[next].focus();
    });
    grid.append(button);
    return button;
  });
  field.append(legend, grid);
  $("pickers").append(field);
  return { label, buttons };
});

function applySample(syllable) {
  selection = decompose(syllable);
  wholeView = false;
  render();
}

const sampleButtons = samples.map((syllable) => {
  const button = make("button", "", syllable);
  button.lang = "ko";
  button.addEventListener("click", () => applySample(syllable));
  $("presets").append(button);
  return button;
});

const guideCards = examples.map((syllable, index) => {
  const card = make("button", "example");
  card.style.setProperty("--accent", colors[index]);
  const glyph = make("span", "example-glyph", syllable);
  glyph.lang = "ko";
  const title = make("strong");
  const desc = make("span", "example-desc");
  const action = make("span", "example-action");
  card.append(make("span", "example-index", "FIG. 0" + (index + 1)), glyph, title, desc, action);
  card.addEventListener("click", () => {
    applySample(syllable);
    $("lab-title").focus({ preventScroll: true });
    $("lab").scrollIntoView();
  });
  $("examples").append(card);
  return { title, desc, action };
});
$("lab-title").tabIndex = -1;

const diagram = $("diagram");
const secondVowel = make("span", "cell vowel no-final");
secondVowel.lang = "ko";
diagram.insertBefore(secondVowel, $("whole-glyph"));

function place(node, letter, [x, y, width, height]) {
  const changed = node.textContent !== letter;
  node.textContent = letter;
  for (const [key, value] of Object.entries({ x, y, w: width, h: height })) {
    node.style.setProperty("--" + key, value + "%");
  }
  node.classList.toggle("no-final", !letter);
  if (changed && letter && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.classList.remove("flash");
    requestAnimationFrame(() => node.classList.add("flash"));
  }
}

function render() {
  const [initial, vowel, final] = selection;
  const syllable = compose(selection);
  const layout = layoutFor(vowel);
  const height = final ? 58 : 84;
  const half = (height - 4) / 2;
  const [first, second] = vowelParts(vowel);
  const leadBox = layout === "side" ? [8, 8, 40, height] :
    [8, 8, layout === "mixed" ? 45 : 84, half];
  const vowelBox = layout === "side" ? [52, 8, 40, height] :
    [8, 12 + half, layout === "mixed" ? 45 : 84, half];
  place($("initial-glyph"), letters[0][initial], leadBox);
  place($("vowel-glyph"), first, vowelBox);
  place(secondVowel, second ?? "", [57, 8, 35, height]);
  place($("final-glyph"), letters[2][final], [8, 70, 84, 22]);
  $("whole-glyph").textContent = syllable;
  if ($("result").textContent !== syllable) $("result").textContent = syllable;
  $("code").textContent = "U+" + syllable.codePointAt(0).toString(16).toUpperCase();
  $("layout").textContent = copy[language][layout];
  diagram.classList.toggle("is-whole", wholeView);
  $("parts").setAttribute("aria-pressed", String(!wholeView));
  $("whole").setAttribute("aria-pressed", String(wholeView));
  groups.forEach(({ buttons }, groupIndex) => buttons.forEach((button, index) => {
    const selected = index === selection[groupIndex];
    button.setAttribute("aria-pressed", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }));
  sampleButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.textContent === syllable)));
  const current = new URL(location.href);
  if (syllable === "한") current.searchParams.delete("s");
  else current.searchParams.set("s", syllable);
  if (language === "en") current.searchParams.delete("lang");
  else current.searchParams.set("lang", language);
  history.replaceState(null, "", current);
}

function translate() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = language === "ko" ? "한글 Lab — 한글 놀이터" : "Hangul Lab — A letter playground";
  document.querySelectorAll("[data-i]").forEach((node) => { node.textContent = t[node.dataset.i]; });
  document.querySelectorAll("[data-label]").forEach((node) => node.setAttribute("aria-label", t[node.dataset.label]));
  document.querySelector("nav").setAttribute("aria-label", t.main);
  $("language").lang = language === "en" ? "ko" : "en";
  $("language").setAttribute("aria-label", language === "en" ? "한국어로 보기" : "Switch to English");
  $("language").firstChild.textContent = language === "en" ? "한국어 " : "English ";
  groups.forEach(({ label }, index) => { label.textContent = t.groups[index]; });
  groups[2].buttons[0].setAttribute("aria-label", t.none);
  guideCards.forEach(({ title, desc, action }, index) => {
    [title.textContent, desc.textContent] = t.examples[index];
    action.textContent = t.use;
  });
  renderHero();
  render();
}

$("language").addEventListener("click", () => {
  language = language === "en" ? "ko" : "en";
  translate();
});
$("parts").addEventListener("click", () => { wholeView = false; render(); });
$("whole").addEventListener("click", () => { wholeView = true; render(); });
$("reset").addEventListener("click", () => applySample("한"));
$("copy").addEventListener("click", async () => {
  const request = ++copyRequest;
  const glyph = compose(selection);
  let key = "copied";
  try { await navigator.clipboard.writeText(glyph); }
  catch { key = "copyError"; }
  if (request !== copyRequest) return;
  clearTimeout(copyTimer);
  const buttonText = $("copy").querySelector("[data-i]");
  buttonText.textContent = copy[language][key];
  $("copy-status").textContent = copy[language][key] + " " + glyph;
  copyTimer = setTimeout(() => {
    buttonText.textContent = copy[language].copy;
    $("copy-status").textContent = "";
  }, 1800);
});

const hero = $("hero-visual");
const pieces = [...hero.querySelectorAll(".piece")];
const heroButtons = [...document.querySelectorAll("[data-hero]")];
const specimens = [...hero.querySelectorAll("[data-specimen]")];
const motion = matchMedia("(prefers-reduced-motion: reduce)");
function renderHero() {
  const index = examples.indexOf(heroSample);
  const t = copy[language];
  const [initial, vowel, final] = decompose(heroSample);
  const components = [letters[0][initial], letters[1][vowel], letters[2][final]].filter(Boolean);
  $("hero-figure").textContent = "0" + (index + 1) + " / " + heroSample;
  $("hero-parts").textContent = components.join(" + ");
  $("hero-layout").textContent = t[heroLabels[index]];
  $("hero-note").textContent = t.heroNotes[index];
  heroButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.hero === heroSample)));
  specimens.forEach((specimen) => specimen.toggleAttribute("hidden", specimen.dataset.specimen !== heroSample));
}
heroButtons.forEach((button) => button.addEventListener("click", () => {
  if (heroSample === button.dataset.hero) return;
  heroSample = button.dataset.hero;
  resetMotion();
  renderHero();
}));
$("hero-cta").addEventListener("click", () => {
  applySample(heroSample);
  $("lab-title").focus({ preventScroll: true });
});
function resetMotion() {
  pieces.forEach((piece) => {
    piece.style.removeProperty("--dx");
    piece.style.removeProperty("--dy");
  });
}
hero.addEventListener("pointermove", (event) => {
  if (motion.matches || event.pointerType === "touch") return;
  const { left, top, width, height } = hero.getBoundingClientRect();
  const x = (event.clientX - left) / width - .5;
  const y = (event.clientY - top) / height - .5;
  hero.querySelectorAll("[data-specimen]:not([hidden]) .piece").forEach((piece, index) => {
    const depth = [32, -45, 54][index];
    piece.style.setProperty("--dx", x * depth + "px");
    piece.style.setProperty("--dy", y * depth + "px");
  });
});
hero.addEventListener("pointerleave", resetMotion);
let scrollFrame = 0;
function updateScrollMotion() {
  scrollFrame = 0;
  const { top, height } = hero.getBoundingClientRect();
  const progress = motion.matches ? 0 : Math.max(0, Math.min(1, (80 - top) / (height * .7)));
  hero.style.setProperty("--assembly", String(progress));
}
function scheduleScrollMotion() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollMotion);
}
window.addEventListener("scroll", scheduleScrollMotion, { passive: true });
window.addEventListener("resize", scheduleScrollMotion);
motion.addEventListener("change", () => {
  resetMotion();
  scheduleScrollMotion();
});
updateScrollMotion();
translate();
