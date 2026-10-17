import { QuestionType } from "@prisma/client";

export type QuestionForCheck = {
  id: number;
  type: QuestionType;
  correctAnswer: unknown;
};

export type SubmittedAnswer = {
  questionId: number;
  answer: unknown;
};

export type QuizRules = {
  passScore: number;
  maxAttempts: number;
  scoringMode: "BEST" | "LAST";
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function compareArrays(a: number[], b: number[]) {
  const left = [...a].sort((x, y) => x - y);
  const right = [...b].sort((x, y) => x - y);

  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function equalJson(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length &&
      left.every((item, index) => equalJson(item, right[index]));
  }
  if (!isObject(left) || !isObject(right)) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length && leftKeys.every((key) =>
    Object.prototype.hasOwnProperty.call(right, key) && equalJson(left[key], right[key]));
}

function isCorrectAnswer(question: QuestionForCheck, submitted: unknown) {
  if (!isObject(question.correctAnswer)) {
    return false;
  }

  switch (question.type) {
    case QuestionType.SINGLE: {
      const correctIndex = question.correctAnswer.index;
      return typeof correctIndex === "number" && submitted === correctIndex;
    }
    case QuestionType.TRUE_FALSE: {
      const expected = question.correctAnswer.value;
      return typeof expected === "boolean" && submitted === expected;
    }
    case QuestionType.MULTIPLE: {
      const indices = question.correctAnswer.indices;
      if (!Array.isArray(indices) || !Array.isArray(submitted)) {
        return false;
      }

      if (!indices.every((item) => Number.isInteger(item)) || !submitted.every((item) => Number.isInteger(item))) return false;
      return compareArrays(indices as number[], submitted as number[]);
    }
    case QuestionType.MATCHING: {
      return equalJson(question.correctAnswer, submitted);
    }
    default:
      return false;
  }
}

export function parseQuizRules(value: unknown): QuizRules {
  if (typeof value === "object" && value !== null) {
    const source = value as Record<string, unknown>;

    const passScore = typeof source.passScore === "number" && Number.isFinite(source.passScore)
      ? Math.max(1, Math.min(100, source.passScore)) : 70;
    const maxAttempts = typeof source.maxAttempts === "number" && Number.isFinite(source.maxAttempts)
      ? Math.max(1, Math.floor(source.maxAttempts)) : 3;
    const scoringMode = source.scoringMode === "LAST" ? "LAST" : "BEST";

    return { passScore, maxAttempts, scoringMode };
  }

  return {
    passScore: 70,
    maxAttempts: 3,
    scoringMode: "BEST"
  };
}

export function calculateQuizScore(questions: QuestionForCheck[], answers: SubmittedAnswer[]) {
  const byId = new Map(answers.map((item) => [item.questionId, item.answer]));

  const questionResults: { questionId: number; isCorrect: boolean }[] = [];
  let correct = 0;

  for (const question of questions) {
    const isCorrect = isCorrectAnswer(question, byId.get(question.id));
    questionResults.push({ questionId: question.id, isCorrect });
    if (isCorrect) correct += 1;
  }

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    correct,
    total,
    percentage,
    questionResults
  };
}
