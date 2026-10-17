export type EditableQuestionType = "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "MATCHING";

export type StoredQuizQuestion = {
  id?: number;
  question: string;
  type: EditableQuestionType;
  options: unknown;
  correctAnswer: unknown;
};

export type EditableQuizQuestion = {
  id?: number;
  clientId: string;
  question: string;
  type: EditableQuestionType;
  options: string[];
  matchingRightOptions: string[];
  correctSingleIndex: number;
  correctMultipleIndices: number[];
  correctBooleanValue: boolean | null;
  correctMatchingIndices: number[];
};

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function optionStrings(value: unknown): string[] {
  // Preserve positions: a blank option must be corrected, never silently removed.
  return Array.isArray(value) ? value.map((item) => typeof item === "string" ? item : "") : [];
}

export function normalizeQuizQuestion(question: StoredQuizQuestion, index: number): EditableQuizQuestion {
  const answer = record(question.correctAnswer);
  const matching = record(question.options);
  const options = question.type === "MATCHING" ? optionStrings(matching.left) : optionStrings(question.options);
  const right = question.type === "MATCHING" ? optionStrings(matching.right) : ["", ""];
  return {
    ...(question.id === undefined ? {} : { id: question.id }),
    clientId: `quiz-${question.id ?? index + 1}`,
    question: question.question,
    type: question.type,
    options,
    matchingRightOptions: right,
    correctSingleIndex: typeof answer.index === "number" ? answer.index : -1,
    correctMultipleIndices: Array.isArray(answer.indices) ? answer.indices.filter((value): value is number => typeof value === "number") : [],
    correctBooleanValue: typeof answer.value === "boolean" ? answer.value : null,
    correctMatchingIndices: options.map((_, leftIndex) => typeof answer[String(leftIndex)] === "number" ? answer[String(leftIndex)] as number : -1)
  };
}

export function createEmptyQuizQuestion(type: EditableQuestionType = "SINGLE"): EditableQuizQuestion {
  return {
    clientId: `quiz-new-${Array.from(globalThis.crypto.getRandomValues(new Uint32Array(2)), (value) => value.toString(36)).join("-")}`,
    question: "Нове питання",
    type,
    options: ["Варіант 1", "Варіант 2"],
    matchingRightOptions: ["Відповідь 1", "Відповідь 2"],
    correctSingleIndex: -1,
    correctMultipleIndices: [],
    correctBooleanValue: null,
    correctMatchingIndices: [-1, -1]
  };
}

export function serializeQuizQuestions(questions: EditableQuizQuestion[]): StoredQuizQuestion[] {
  // This codec also powers the live JSON preview, so validation happens separately.
  return questions.map((question) => ({
    ...(question.id === undefined ? {} : { id: question.id }),
    question: question.question.trim(),
    type: question.type,
    options: question.type === "MATCHING"
      ? { left: question.options.map((option) => option.trim()), right: question.matchingRightOptions.map((option) => option.trim()) }
      : question.type === "TRUE_FALSE" ? ["True", "False"] : question.options.map((option) => option.trim()),
    correctAnswer: question.type === "MATCHING"
      ? Object.fromEntries(question.options.map((_, index) => [String(index), question.correctMatchingIndices[index] ?? -1]))
      : question.type === "TRUE_FALSE" ? { value: question.correctBooleanValue }
      : question.type === "MULTIPLE" ? { indices: [...question.correctMultipleIndices] }
      : { index: question.correctSingleIndex }
  }));
}

export function validateQuizQuestions(questions: StoredQuizQuestion[]): string | null {
  for (const [questionIndex, question] of questions.entries()) {
    const prefix = `Питання ${questionIndex + 1}: `;
    if (question.question.trim().length < 2) return prefix + "додайте текст питання.";
    const answer = record(question.correctAnswer);
    const matching = record(question.options);
    const options = question.type === "MATCHING" ? matching.left : question.options;
    if (!Array.isArray(options) || options.length < 2 || options.some((option) => typeof option !== "string" || !option.trim())) {
      return prefix + "потрібно щонайменше два непорожні варіанти. Заповніть або видаліть порожні рядки.";
    }
    const validIndex = (value: unknown, count = options.length) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < count;
    if (question.type === "SINGLE" && !validIndex(answer.index)) return prefix + "оберіть правильний варіант.";
    if (question.type === "MULTIPLE" && (!Array.isArray(answer.indices) || !answer.indices.length ||
      answer.indices.some((value) => !validIndex(value)) || new Set(answer.indices).size !== answer.indices.length)) {
      return prefix + "оберіть правильні варіанти без повторів.";
    }
    if (question.type === "TRUE_FALSE" && (typeof answer.value !== "boolean" || options.length !== 2)) return prefix + "оберіть True або False.";
    if (question.type === "MATCHING") {
      const right = matching.right;
      if (!Array.isArray(right) || right.length < 2 || right.some((option) => typeof option !== "string" || !option.trim())) return prefix + "заповніть щонайменше два праві варіанти.";
      const keys = Object.keys(answer);
      if (keys.length !== options.length || options.some((_, index) => !Object.hasOwn(answer, String(index)) || !validIndex(answer[String(index)], right.length))) {
        return prefix + "оберіть відповідність для кожного лівого пункту.";
      }
    }
  }
  return null;
}

export function validateQuestionIds(questions: Array<{ id?: number }>, existingIds: number[], deletedIds: number[] = []): string | null {
  const submittedIds = questions.flatMap((question) => question.id === undefined ? [] : [question.id]);
  const allIds = [...submittedIds, ...deletedIds];
  if (new Set(allIds).size !== allIds.length || allIds.some((id) => !Number.isInteger(id) || id <= 0 || !existingIds.includes(id))) {
    return "Питання повторюється або не належить цьому модулю. Оновіть сторінку і спробуйте ще раз.";
  }
  return null;
}
