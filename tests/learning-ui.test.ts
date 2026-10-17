import { test } from "node:test";
import assert from "node:assert/strict";
import { getBestModuleScores, getQuizStatistics } from "../lib/learning-statistics";
import { getActivityDay, getActivityStreak, shiftActivityDay } from "../lib/activity-days";
import { getMatchingOptions, hasMatchingAnswer } from "../lib/matching-quiz";
import { getVideoSource } from "../lib/video-source";

test("zero-only attempts remain in average, tested modules and pass rate", () => {
  assert.deepEqual(getQuizStatistics([{ moduleId: 1, score: 100, passed: true }, { moduleId: 2, score: 0, passed: false }]), {
    avgScore: 50, passRate: 50, testedModules: 2
  });
  assert.equal(getBestModuleScores([{ moduleId: 2, score: 0 }]).get(2), 0);
});

test("multiple attempts for one module count once and use its best result", () => {
  assert.deepEqual(getQuizStatistics([{ moduleId: 1, score: 0, passed: false }, { moduleId: 1, score: 80, passed: true }, { moduleId: 2, score: 20, passed: false }]), {
    avgScore: 50, passRate: 50, testedModules: 2
  });
});

test("Kyiv midnight and late UTC evening belong to the correct portal day", () => {
  assert.equal(getActivityDay("2026-10-13T00:00:00+03:00"), "2026-10-13");
  assert.equal(getActivityDay("2026-10-12T22:30:00Z"), "2026-10-13");
  assert.equal(getActivityDay("2026-01-12T22:30:00Z"), "2026-01-13");
});

test("calendar shifts remain exact through DST, leap day and year boundaries", () => {
  assert.equal(shiftActivityDay("2026-03-29", -1), "2026-03-28");
  assert.equal(shiftActivityDay("2024-03-01", -1), "2024-02-29");
  assert.equal(shiftActivityDay("2026-01-01", -1), "2025-12-31");
});

test("streak allows today to be unfinished without combining separated activity", () => {
  assert.equal(getActivityStreak(["2026-10-12", "2026-10-11", "2026-10-08"], "2026-10-13"), 2);
  assert.equal(getActivityStreak(["2026-10-13", "2026-10-11"], "2026-10-13"), 1);
});

test("MATCHING answer is complete only after all valid selections", () => {
  const options = getMatchingOptions({ left: ["RAM", "SSD"], right: ["Files", "Running programs"] });
  assert.equal(hasMatchingAnswer({ "0": 1 }, options), false);
  assert.equal(hasMatchingAnswer({ "0": 1, "1": 0 }, options), true);
  assert.equal(hasMatchingAnswer({ "0": 1, "1": 9 }, options), false);
  assert.equal(hasMatchingAnswer({ "0": 1, "1": 0, extra: 1 }, options), false);
});

test("YouTube watch, short and embed URLs become a working embed", () => {
  for (const url of ["https://youtube.com/watch?v=abcDEF123_-", "https://youtu.be/abcDEF123_-?t=3", "https://www.youtube.com/embed/abcDEF123_-"]) {
    assert.deepEqual(getVideoSource(url, "youtube"), { kind: "iframe", url: "https://www.youtube-nocookie.com/embed/abcDEF123_-" });
  }
});

test("Vimeo and direct videos use the intended player and unsafe schemes are rejected", () => {
  assert.deepEqual(getVideoSource("https://vimeo.com/123456"), { kind: "iframe", url: "https://player.vimeo.com/video/123456" });
  assert.deepEqual(getVideoSource("/uploads/lesson.mp4"), { kind: "video", url: "/uploads/lesson.mp4" });
  assert.equal(getVideoSource("javascript:alert(1)"), null);
  assert.equal(getVideoSource("https://youtu.be/missing"), null);
});
