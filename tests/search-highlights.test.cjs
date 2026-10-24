const test = require("node:test");
const assert = require("node:assert/strict");
const { splitSearchHighlights } = require("../lib/search-highlights.ts");

function marked(text, query) {
  const parts = splitSearchHighlights(text, query);
  assert.equal(parts.map(part => part.text).join(""), text, "highlighting preserves every source character");
  return parts.filter(part => part.highlighted).map(part => part.text);
}

test("search highlights canonical names for Ukrainian aliases and compact model queries", () => {
  assert.deepEqual(marked("Apple iPhone 17 Pro Max — камера", "айфон17 promax"), ["iPhone", "17", "Pro", "Max"]);
  assert.deepEqual(marked("iPhone17ProMax", "айфон 17 pro max"), ["iPhone17ProMax"]);
  assert.deepEqual(marked("Айфони 17 та iPad Air", "iphone17 айпад"), ["Айфони", "17", "iPad"]);
  assert.deepEqual(marked("iPhone 17e", "айфон17е"), ["iPhone", "17e"]);
  assert.deepEqual(marked("iPhone 17 Pro Max", "айфон17промакс"), ["iPhone", "17", "Pro", "Max"]);
});

test("apostrophes and partial Ukrainian words use the same matching as the index", () => {
  assert.deepEqual(marked("Пам'ять, пам’ять і памʼять. Камера 48 Мп.", "пам’ять камер"), ["Пам'ять", "пам’ять", "памʼять", "Камер"]);
  assert.deepEqual(marked("Пам’ять", "память"), ["Пам’ять"]);
  assert.deepEqual(marked("КАМЕРА", "камер"), ["КАМЕР"]);
});

test("numeric terms do not highlight unrelated generations or chip numbers", () => {
  assert.deepEqual(marked("iPhone 17, iPhone X (2017), A17 Pro, 170 Гц", "17"), ["17", "17"]);
  assert.deepEqual(marked("Екран 120 Гц та 1200 ніт", "120 Гц"), ["120", "Гц"]);
});

test("exact punctuation and overlapping terms retain readable original copy", () => {
  assert.deepEqual(marked("USB-C, A+ і камера", "USB-C A+ камер камера"), ["USB-C", "A+", "камера"]);
  assert.deepEqual(marked("<img src=x onerror=alert(1)> A+", "A+"), ["a", "A+"]);
  assert.deepEqual(marked("Немає збігів", ""), []);
});

test("Unicode normalization preserves offsets, combining marks and compatibility glyphs", () => {
  assert.deepEqual(marked("📱 ＩＰｈｏｎｅ １７ — пам’ять", "iphone17 память"), ["ＩＰｈｏｎｅ", "１７", "пам’ять"]);
  assert.deepEqual(marked("Cafe\u0301 та Café", "café"), ["Cafe\u0301", "Café"]);
  assert.deepEqual(marked("ﬁlm", "film"), ["ﬁlm"]);
});
