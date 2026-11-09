export const letters = [
  [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"],
  [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"],
  ["", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"],
];

export function compose([initial, vowel, final]) {
  return String.fromCodePoint(0xac00 + (initial * 21 + vowel) * 28 + final);
}

export function decompose(syllable) {
  if (typeof syllable !== "string" || syllable.length !== 1) return null;
  const index = syllable.codePointAt(0) - 0xac00;
  if (index < 0 || index >= 11172) return null;
  return [Math.floor(index / 588), Math.floor(index / 28) % 21, index % 28];
}

const horizontal = new Set([8, 12, 13, 17, 18]);
const compounds = {
  9: ["ㅗ", "ㅏ"], 10: ["ㅗ", "ㅐ"], 11: ["ㅗ", "ㅣ"],
  14: ["ㅜ", "ㅓ"], 15: ["ㅜ", "ㅔ"], 16: ["ㅜ", "ㅣ"], 19: ["ㅡ", "ㅣ"],
};

export function layoutFor(vowel) {
  if (Object.hasOwn(compounds, vowel)) return "mixed";
  return horizontal.has(vowel) ? "stacked" : "side";
}

export function vowelParts(vowel) {
  return compounds[vowel] ?? [letters[1][vowel]];
}
