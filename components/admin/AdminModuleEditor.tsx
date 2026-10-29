"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Bold,
  Quote,
  Eye,
  FileImage,
  FileJson,
  FileText,
  Film,
  GripVertical,
  Heading3,
  ListChecks,
  Loader2,
  PackagePlus,
  Plus,
  Save,
  TestTube2,
  Trash2,
  type LucideIcon
} from "lucide-react";
import type {
  FactsBlock,
  ImageBlock,
  ModuleBlockType,
  ModuleCatalogColor,
  ModuleCatalogProduct,
  ModuleContentBlock,
  PdfBlock,
  ProductCatalogBlock,
  TextBlock,
  VideoBlock
} from "@/lib/module-content";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { LearningGuideEditor } from "@/components/admin/LearningGuideEditor";
import { parseLearningGuide, type LearningGuide } from "@/lib/learning-guide";
import { parseModuleContentBlocks } from "@/lib/module-content";
import { createEmptyQuizQuestion, normalizeQuizQuestion, serializeQuizQuestions, validateQuizQuestions, type EditableQuestionType, type EditableQuizQuestion } from "@/lib/quiz-editor";
import { getRequestError, requestJson } from "@/lib/http-client";

type CategoryOption = {
  id: number;
  name: string;
  brandName: string;
};

type AdminModuleEditorProps = {
  module: {
    id: number;
    title: string;
    description: string;
    durationMin: number;
    sortOrder: number;
    isPublished: boolean;
    categoryId: number;
    contentBlocks: unknown;
    questions: Array<{
      id: number;
      question: string;
      type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "MATCHING";
      options: unknown;
      correctAnswer: unknown;
      sortOrder: number;
    }>;
  };
  categories: CategoryOption[];
};





const BLOCK_OPTIONS: Array<{
  type: ModuleBlockType;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    type: "video",
    label: "Відео",
    description: "YouTube, Vimeo або пряме відео-посилання",
    icon: Film
  },
  {
    type: "text",
    label: "Текст",
    description: "HTML або структурований текстовий блок",
    icon: FileText
  },
  {
    type: "image",
    label: "Зображення",
    description: "Ілюстрація, рендер або рекламний візуал",
    icon: FileImage
  },
  {
    type: "facts",
    label: "Факти",
    description: "Короткі тези, аргументи та акценти",
    icon: ListChecks
  },
  {
    type: "pdf",
    label: "PDF",
    description: "Конспект, мануал або інструкція",
    icon: FileJson
  },
  {
    type: "productCatalog",
    label: "Каталог товарів",
    description: "Картки моделей з кольорами та характеристиками",
    icon: PackagePlus
  }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createIdentifier(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}













function ensureDefaultColor(colors: ModuleCatalogColor[]) {
  if (colors.length === 0) {
    return [createEmptyColor(true)];
  }

  if (colors.some((color) => color.default)) {
    return colors;
  }

  return colors.map((color, index) => ({
    ...color,
    default: index === 0
  }));
}

function createEmptyColor(isDefault = true): ModuleCatalogColor {
  return {
    label: "Silver",
    imageUrl: "",
    caption: "Колір: Silver",
    default: isDefault
  };
}

function createEmptyProduct(): ModuleCatalogProduct {
  return {
    slug: createIdentifier("product"),
    title: "Нова модель",
    family: "",
    summary: "",
    overview: [],
    highlights: [],
    colors: [createEmptyColor(true)]
  };
}

function createEmptyBlock(type: ModuleBlockType): ModuleContentBlock {
  switch (type) {
    case "video":
      return {
        type: "video",
        title: "Відео-огляд",
        provider: "youtube",
        url: ""
      };
    case "pdf":
      return {
        type: "pdf",
        title: "PDF-матеріал",
        url: ""
      };
    case "text":
      return {
        type: "text",
        title: "Текстовий блок",
        html: "<p>Додайте основний текст модуля.</p>"
      };
    case "image":
      return {
        type: "image",
        title: "Зображення",
        url: "",
        caption: ""
      };
    case "facts":
      return {
        type: "facts",
        title: "Ключові факти",
        items: []
      };
    case "productCatalog":
      return {
        type: "productCatalog",
        title: "Каталог моделей",
        products: [createEmptyProduct()]
      };
  }
}

function normalizeColor(value: unknown, index: number): ModuleCatalogColor {
  if (!isRecord(value)) {
    return createEmptyColor(index === 0);
  }

  return {
    label: normalizeString(value.label, index === 0 ? "Silver" : `Color ${index + 1}`),
    imageUrl: normalizeString(value.imageUrl),
    caption: normalizeString(value.caption),
    default: value.default === true
  };
}

function normalizeProduct(value: unknown, index: number): ModuleCatalogProduct {
  if (!isRecord(value)) {
    return {
      ...createEmptyProduct(),
      slug: `product-${index + 1}`
    };
  }

  const colors = ensureDefaultColor(
    Array.isArray(value.colors) ? value.colors.map((color, colorIndex) => normalizeColor(color, colorIndex)) : []
  );

  return {
    slug: normalizeString(value.slug, `product-${index + 1}`),
    title: normalizeString(value.title, `Модель ${index + 1}`),
    family: normalizeString(value.family),
    summary: normalizeString(value.summary),
    overview: normalizeStringArray(value.overview),
    highlights: normalizeStringArray(value.highlights),
    colors
  };
}

function normalizeBlockContent(block: ModuleContentBlock, index: number): ModuleContentBlock {
  switch (block.type) {
    case "video":
      return {
        type: "video",
        title: normalizeString(block.title, `Відео ${index + 1}`),
        provider: normalizeString(block.provider, "youtube"),
        url: normalizeString(block.url)
      } satisfies VideoBlock;
    case "pdf":
      return {
        type: "pdf",
        title: normalizeString(block.title, `PDF ${index + 1}`),
        url: normalizeString(block.url)
      } satisfies PdfBlock;
    case "text":
      return {
        type: "text",
        title: normalizeString(block.title, `Текст ${index + 1}`),
        html: normalizeString(block.html)
      } satisfies TextBlock;
    case "image":
      return {
        type: "image",
        title: normalizeString(block.title, `Зображення ${index + 1}`),
        url: normalizeString(block.url),
        caption: normalizeString(block.caption)
      } satisfies ImageBlock;
    case "facts":
      return {
        type: "facts",
        title: normalizeString(block.title, `Факти ${index + 1}`),
        items: normalizeStringArray(block.items)
      } satisfies FactsBlock;
    case "productCatalog":
      return {
        type: "productCatalog",
        title: normalizeString(block.title, `Каталог ${index + 1}`),
        products: Array.isArray(block.products)
          ? block.products.map((product, productIndex) => normalizeProduct(product, productIndex))
          : [createEmptyProduct()]
      } satisfies ProductCatalogBlock;
  }
}

function normalizeBlock(block: ModuleContentBlock, index: number): ModuleContentBlock {
  const normalized = normalizeBlockContent(block, index);
  // Preserve the draft verbatim. Required fields can be temporarily empty while
  // editing; validate before save instead of silently dropping those edits.
  if (Object.hasOwn(block, "learningGuide")) normalized.learningGuide = block.learningGuide;
  return normalized;
}

export function normalizeModuleEditorBlocks(value: unknown) {
  return parseModuleContentBlocks(value).map((block, index) => normalizeBlock(block, index));
}

export function remapEditorGuideTargets(blocks: ModuleContentBlock[], transform: (anchor: string) => string | null): ModuleContentBlock[] {
  return blocks.map(block => {
    const guide = block.learningGuide;
    if (!guide) return block;
    const routes = (items: LearningGuide["route"]) => items.flatMap(item => {
      const anchor = transform(item.anchor);
      return anchor ? [{ ...item, anchor }] : [];
    });
    return { ...block, learningGuide: { ...guide, route: routes(guide.route), reference: routes(guide.reference),
      ...(guide.comparisons ? { comparisons: guide.comparisons.flatMap(item => {
        const left = transform(item.left.anchor), right = transform(item.right.anchor);
        return left && right ? [{ ...item, left: { ...item.left, anchor: left }, right: { ...item.right, anchor: right } }] : [];
      }) } : {}),
      sources: guide.sources.map(source => ({ ...source, anchors: source.anchors.flatMap(anchor => {
        const next = transform(anchor); return next ? [next] : [];
      }) })) } };
  });
}

export function reorderModuleEditorBlocks(before: ModuleContentBlock[], after: ModuleContentBlock[], moduleId: number, content = after) {
  return remapEditorGuideTargets(content, anchor => {
    const match = anchor.match(new RegExp(`^module-${moduleId}-topic-(\\d+)(?=-|$)`));
    if (!match) return anchor;
    const original = before[Number(match[1]) - 1];
    const index = original ? after.indexOf(original) : -1;
    return index < 0 ? null : anchor.replace(match[0], `module-${moduleId}-topic-${index + 1}`);
  });
}

export function removeModuleEditorBlock(blocks: ModuleContentBlock[], index: number, moduleId: number) {
  const removed = blocks[index];
  if (!removed || (removed.learningGuide && blocks.length === 1)) return blocks;
  const remaining = blocks.filter((_, currentIndex) => currentIndex !== index);
  const content = removed.learningGuide && !remaining.some(block => block.learningGuide)
    ? remaining.map((block, i) => i === 0 ? { ...block, learningGuide: removed.learningGuide } : block) : remaining;
  // `remaining` retains object identity for the position map; `content` may
  // carry the removed host's guide without changing any surviving lesson.
  return reorderModuleEditorBlocks(blocks, remaining, moduleId, content);
}

export function reorderModuleEditorProducts(blocks: ModuleContentBlock[], blockIndex: number, products: ModuleCatalogProduct[], moduleId: number) {
  const catalog = blocks[blockIndex];
  if (!catalog || catalog.type !== "productCatalog") return blocks;
  const next = blocks.map((block, index) => index === blockIndex ? { ...catalog, products } : block);
  return remapEditorGuideTargets(next, anchor => {
    const match = anchor.match(new RegExp(`^module-${moduleId}-topic-${blockIndex + 1}-product-(\\d+)(?=-|$)`));
    if (!match) return anchor;
    const original = catalog.products[Number(match[1]) - 1];
    const index = original ? products.indexOf(original) : -1;
    return index < 0 ? null : anchor.replace(match[0], `module-${moduleId}-topic-${blockIndex + 1}-product-${index + 1}`);
  });
}

function getBlockMeta(type: ModuleBlockType) {
  return BLOCK_OPTIONS.find((item) => item.type === type) ?? BLOCK_OPTIONS[0];
}

function BlockToolbar({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete
}: {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowDown className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-100"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function TextToolbarButton({
  label,
  icon: Icon,
  onClick
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-[rgba(40,178,158,0.24)] hover:bg-[rgba(40,178,158,0.12)]"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

export function AdminModuleEditor({ module, categories }: AdminModuleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [durationMin, setDurationMin] = useState(String(module.durationMin));
  const [sortOrder, setSortOrder] = useState(String(module.sortOrder));
  const [isPublished, setIsPublished] = useState(module.isPublished);
  const [categoryId, setCategoryId] = useState(String(module.categoryId));
  const [blocks, setBlocks] = useState<ModuleContentBlock[]>(() => normalizeModuleEditorBlocks(module.contentBlocks));
  const [quizQuestions, setQuizQuestions] = useState<EditableQuizQuestion[]>(() =>
    module.questions
      .map((question, index) => normalizeQuizQuestion(question, index))
  );
  const [savedQuestionIds, setSavedQuestionIds] = useState(() => module.questions.map((question) => question.id));
  const activeModuleRef = useRef(module.id);
  useEffect(() => {
    if (activeModuleRef.current === module.id) return;
    activeModuleRef.current = module.id;
    setTitle(module.title);
    setDescription(module.description);
    setDurationMin(String(module.durationMin));
    setSortOrder(String(module.sortOrder));
    setIsPublished(module.isPublished);
    setCategoryId(String(module.categoryId));
    setBlocks(normalizeModuleEditorBlocks(module.contentBlocks));
    setQuizQuestions(module.questions.map(normalizeQuizQuestion));
    setSavedQuestionIds(module.questions.map((question) => question.id));
  }, [module]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverBlockIndex, setDragOverBlockIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const textAreaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const prettySize = useMemo(() => {
    const raw = JSON.stringify(blocks);
    return `${Math.max(1, Math.round(raw.length / 1024))} KB`;
  }, [blocks]);

  const productCardsCount = useMemo(
    () =>
      blocks.reduce((sum, block) => {
        if (block.type !== "productCatalog") {
          return sum;
        }

        return sum + block.products.length;
      }, 0),
    [blocks]
  );

  const quizQuestionsCount = quizQuestions.length;
  const learningGuide = blocks.find(block => block.learningGuide !== undefined)?.learningGuide;

  function updateLearningGuide(value: LearningGuide | undefined) {
    setBlocks(previous => {
      if (!previous.length) return previous;
      const host = Math.max(0, previous.findIndex(block => block.learningGuide !== undefined));
      return previous.map((block, index) => {
        const next = { ...block }; delete next.learningGuide;
        if (value && index === host) next.learningGuide = value;
        return next;
      });
    });
  }

  function updateBlockAt(index: number, updater: (block: ModuleContentBlock) => ModuleContentBlock) {
    setBlocks((prev) => prev.map((block, currentIndex) => (currentIndex === index ? normalizeBlock(updater(block), currentIndex) : block)));
  }

  function replaceBlock(index: number, block: ModuleContentBlock) {
    setBlocks((prev) => prev.map((item, currentIndex) => (currentIndex === index ? normalizeBlock({ ...block,
      ...(item.learningGuide ? { learningGuide: item.learningGuide } : {}) }, currentIndex) : item)));
  }

  function addBlock(type: ModuleBlockType) {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  }

  function removeBlock(index: number) {
    if (blocks.length === 1 && blocks[index]?.learningGuide) {
      setError("Спершу додайте інший блок або приберіть навчальний супровід, щоб не втратити маршрут і джерела.");
      return;
    }
    setBlocks((prev) => removeModuleEditorBlock(prev, index, module.id));
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return reorderModuleEditorBlocks(prev, next, module.id);
    });
  }

  function moveBlockToIndex(fromIndex: number, toIndex: number) {
    setBlocks((prev) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return reorderModuleEditorBlocks(prev, next, module.id);
    });
  }

  function withTextSelection(
    index: number,
    transform: (currentHtml: string, selectionStart: number, selectionEnd: number) => {
      nextHtml: string;
      nextSelectionStart: number;
      nextSelectionEnd: number;
    }
  ) {
    const textArea = textAreaRefs.current[index];
    const block = blocks[index];

    if (!textArea || !block || block.type !== "text") {
      return;
    }

    const selectionStart = textArea.selectionStart ?? 0;
    const selectionEnd = textArea.selectionEnd ?? selectionStart;
    const result = transform(block.html, selectionStart, selectionEnd);

    replaceBlock(index, {
      ...block,
      html: result.nextHtml
    });

    requestAnimationFrame(() => {
      const target = textAreaRefs.current[index];

      if (!target) {
        return;
      }

      target.focus();
      target.setSelectionRange(result.nextSelectionStart, result.nextSelectionEnd);
    });
  }

  function wrapTextSelection(index: number, before: string, after: string, fallback: string) {
    withTextSelection(index, (currentHtml, selectionStart, selectionEnd) => {
      const selected = currentHtml.slice(selectionStart, selectionEnd);
      const content = selected || fallback;
      const replacement = `${before}${content}${after}`;
      const nextHtml = currentHtml.slice(0, selectionStart) + replacement + currentHtml.slice(selectionEnd);
      const nextSelectionStart = selectionStart + before.length;
      const nextSelectionEnd = nextSelectionStart + content.length;

      return {
        nextHtml,
        nextSelectionStart,
        nextSelectionEnd
      };
    });
  }

  function insertListIntoText(index: number) {
    withTextSelection(index, (currentHtml, selectionStart, selectionEnd) => {
      const selected = currentHtml.slice(selectionStart, selectionEnd);
      const source = selected || "Пункт 1\nПункт 2";
      const lines = source
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      const replacement = `<ul>\n${lines.map((line) => `  <li>${line}</li>`).join("\n")}\n</ul>`;
      const nextHtml = currentHtml.slice(0, selectionStart) + replacement + currentHtml.slice(selectionEnd);

      return {
        nextHtml,
        nextSelectionStart: selectionStart,
        nextSelectionEnd: selectionStart + replacement.length
      };
    });
  }

  function updateCatalogBlock(index: number, updater: (block: ProductCatalogBlock) => ProductCatalogBlock) {
    updateBlockAt(index, (block) => {
      if (block.type !== "productCatalog") {
        return block;
      }

      return normalizeBlock(updater(block), index);
    });
  }

  function updateCatalogProduct(
    blockIndex: number,
    productIndex: number,
    updater: (product: ModuleCatalogProduct) => ModuleCatalogProduct
  ) {
    updateCatalogBlock(blockIndex, (block) => ({
      ...block,
      products: block.products.map((product, currentIndex) =>
        currentIndex === productIndex ? normalizeProduct(updater(product), currentIndex) : product
      )
    }));
  }

  function addCatalogProduct(blockIndex: number) {
    updateCatalogBlock(blockIndex, (block) => ({
      ...block,
      products: [...block.products, createEmptyProduct()]
    }));
  }

  function removeCatalogProduct(blockIndex: number, productIndex: number) {
    setBlocks(previous => {
      const block = previous[blockIndex];
      if (!block || block.type !== "productCatalog") return previous;
      const products = block.products.length === 1 ? [createEmptyProduct()] : block.products.filter((_, index) => index !== productIndex);
      return reorderModuleEditorProducts(previous, blockIndex, products, module.id);
    });
  }

  function moveCatalogProduct(blockIndex: number, productIndex: number, direction: "up" | "down") {
    setBlocks(previous => {
      const block = previous[blockIndex];
      if (!block || block.type !== "productCatalog") return previous;
      const targetIndex = direction === "up" ? productIndex - 1 : productIndex + 1;

      if (targetIndex < 0 || targetIndex >= block.products.length) {
        return previous;
      }

      const nextProducts = [...block.products];
      const [item] = nextProducts.splice(productIndex, 1);
      nextProducts.splice(targetIndex, 0, item);

      return reorderModuleEditorProducts(previous, blockIndex, nextProducts, module.id);
    });
  }

  function addCatalogColor(blockIndex: number, productIndex: number) {
    updateCatalogProduct(blockIndex, productIndex, (product) => ({
      ...product,
      colors: [...product.colors, createEmptyColor(product.colors.length === 0)]
    }));
  }

  function updateCatalogColor(
    blockIndex: number,
    productIndex: number,
    colorIndex: number,
    patch: Partial<ModuleCatalogColor>
  ) {
    updateCatalogProduct(blockIndex, productIndex, (product) => ({
      ...product,
      colors: ensureDefaultColor(
        product.colors.map((color, currentIndex) =>
          currentIndex === colorIndex
            ? {
                ...color,
                ...patch
              }
            : patch.default
              ? { ...color, default: false }
              : color
        )
      )
    }));
  }

  function removeCatalogColor(blockIndex: number, productIndex: number, colorIndex: number) {
    updateCatalogProduct(blockIndex, productIndex, (product) => {
      const filtered = product.colors.filter((_, currentIndex) => currentIndex !== colorIndex);

      return {
        ...product,
        colors: ensureDefaultColor(filtered)
      };
    });
  }

  function addQuizQuestion(type: EditableQuestionType) {
    setQuizQuestions((prev) => [...prev, createEmptyQuizQuestion(type)]);
  }

  function updateQuizQuestion(questionIndex: number, updater: (question: EditableQuizQuestion) => EditableQuizQuestion) {
    setQuizQuestions((previous) => previous.map((question, index) => index === questionIndex ? updater(question) : question));
  }

  function removeQuizQuestion(questionIndex: number) {
    setQuizQuestions((prev) => prev.filter((_, currentIndex) => currentIndex !== questionIndex));
  }

  function moveQuizQuestion(questionIndex: number, direction: "up" | "down") {
    setQuizQuestions((prev) => {
      const targetIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [item] = next.splice(questionIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }

  function addQuizOption(questionIndex: number) {
    updateQuizQuestion(questionIndex, (question) => {
      if (question.type === "TRUE_FALSE") {
        return question;
      }

      return {
        ...question,
        options: [...question.options, `Варіант ${question.options.length + 1}`]
      };
    });
  }

  function updateQuizOption(questionIndex: number, optionIndex: number, value: string) {
    updateQuizQuestion(questionIndex, (question) => ({
      ...question,
      options: question.options.map((option, currentIndex) => (currentIndex === optionIndex ? value : option))
    }));
  }

  function removeQuizOption(questionIndex: number, optionIndex: number) {
    updateQuizQuestion(questionIndex, (question) => {
      if (question.type === "TRUE_FALSE" || question.options.length <= 2) {
        return question;
      }

      const nextOptions = question.options.filter((_, currentIndex) => currentIndex !== optionIndex);
      const nextMultiple = question.correctMultipleIndices
        .filter((index) => index !== optionIndex)
        .map((index) => (index > optionIndex ? index - 1 : index));

      return {
        ...question,
        options: nextOptions,
        correctSingleIndex:
          question.correctSingleIndex === optionIndex
            ? -1
            : question.correctSingleIndex > optionIndex
              ? question.correctSingleIndex - 1
              : question.correctSingleIndex,
        correctMultipleIndices: nextMultiple
      };
    });
  }

  function toggleMultipleCorrectAnswer(questionIndex: number, optionIndex: number) {
    updateQuizQuestion(questionIndex, (question) => {
      if (question.type !== "MULTIPLE") {
        return question;
      }

      const exists = question.correctMultipleIndices.includes(optionIndex);

      return {
        ...question,
        correctMultipleIndices: exists
          ? question.correctMultipleIndices.filter((index) => index !== optionIndex)
          : [...question.correctMultipleIndices, optionIndex]
      };
    });
  }

  function removeMatchingOption(questionIndex: number, side: "left" | "right", optionIndex: number) {
    updateQuizQuestion(questionIndex, (question) => {
      if ((side === "left" ? question.options : question.matchingRightOptions).length <= 2) return question;
      if (side === "left") return { ...question,
        options: question.options.filter((_, index) => index !== optionIndex),
        correctMatchingIndices: question.options.filter((_, index) => index !== optionIndex).map((_, index) =>
          question.correctMatchingIndices[index >= optionIndex ? index + 1 : index] ?? -1) };
      return { ...question,
        matchingRightOptions: question.matchingRightOptions.filter((_, index) => index !== optionIndex),
        correctMatchingIndices: question.correctMatchingIndices.map((index) => index === optionIndex ? -1 : index > optionIndex ? index - 1 : index) };
    });
  }

  function saveModule() {
    const guides = blocks.filter(block => Object.hasOwn(block, "learningGuide"));
    if (guides.length > 1 || guides.some(block => !parseLearningGuide(block.learningGuide, module.id))) {
      setError("Перевірте навчальний супровід: потрібні коректна дата, 1–3 цілі, заповнені поля, HTTPS-посилання й переходи в межах цього модуля. Супровід має бути лише в одному блоці.");
      setNotice(null);
      return;
    }
    const submittedDrafts = quizQuestions;
    const questions = serializeQuizQuestions(submittedDrafts);
    const validationError = validateQuizQuestions(questions);
    if (validationError) { setError(validationError); setNotice(null); return; }
    const retainedIds = new Set(questions.flatMap((question) => question.id === undefined ? [] : [question.id]));
    const deletedQuestionIds = savedQuestionIds.filter((id) => !retainedIds.has(id));
    startTransition(async () => {
      setError(null);
      setNotice(null);
      try {
        const data = await requestJson<{ questions?: Array<{ id: number }>; questionIds?: number[] }>("/api/admin/content", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ entity: "module", id: module.id, categoryId: Number(categoryId), title: title.trim(),
            description: description.trim(), durationMin: Number(durationMin), sortOrder: Number(sortOrder),
            isPublished, contentBlocks: blocks, questions, deletedQuestionIds })
        });
        if (data.questions) {
          const ids = new Map(submittedDrafts.map((question, index) => [question.clientId, data.questions?.[index]?.id]));
          setQuizQuestions((current) => current.map((question) => ids.get(question.clientId) === undefined ? question : { ...question, id: ids.get(question.clientId) }));
          setSavedQuestionIds(data.questionIds ?? data.questions.map((question) => question.id));
        }
        setNotice("Модуль і тест оновлено");
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      }
    });
  }

  function deleteModule() {
    if (!window.confirm(`Видалити модуль «${module.title}»? Цю дію не можна скасувати.`)) return;
    startTransition(async () => {
      setError(null);
      try {
        await requestJson(`/api/admin/content?entity=module&id=${module.id}`, { method: "DELETE" });
        router.push("/admin/content");
        router.refresh();
      } catch (requestError) { setError(getRequestError(requestError)); }
    });
  }

  return (
    <section className="space-y-4">
      <LearningGuideEditor value={learningGuide} moduleId={module.id} blocks={blocks} onChange={updateLearningGuide} />
      <section className="card relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,178,158,0.16),transparent_26%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_54%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/admin" className="underline">
                Адмін-панель
              </Link>
              <span>/</span>
              <span className="text-slate-300">Редактор модуля</span>
            </div>

            <span className="portal-chip mt-5 inline-flex">Візуальний редактор матеріалу</span>
            <h1 className="portal-page-title mt-4">{module.title}</h1>
            <p className="portal-subtitle mt-3 max-w-3xl">
              Тепер модуль можна редагувати не сирим JSON, а як набір живих блоків: відео, текст, PDF, зображення,
              факти та каталоги товарів. Це вже ближче до реальної CMS усередині адмінки.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                ID модуля: {module.id}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {blocks.length} блоків
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {productCardsCount} товарних карток
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                {quizQuestionsCount} питань у тесті
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                Обсяг структури: {prettySize}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600">
                Статус: {isPublished ? "Опубліковано" : "Чернетка"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Link
              href={`/module/${module.id}`}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/[0.04]"
            >
              <Eye className="size-4" aria-hidden="true" />
              Переглянути матеріал
            </Link>
            <Link
              href={`/module/${module.id}/quiz`}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/[0.04]"
            >
              <TestTube2 className="size-4" aria-hidden="true" />
              Відкрити тест
            </Link>
            <button
              type="button"
              onClick={deleteModule}
              disabled={isPending}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/16 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
              Видалити модуль
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <article className="card xl:order-2 xl:self-start xl:sticky xl:top-24 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Save className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Налаштування модуля</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Метадані та тест</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Назва модуля"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Опис модуля"
              rows={5}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.brandName} · {category.name}
                </option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2 text-sm text-slate-300">
                <span>Тривалість (хв)</span>
                <input
                  value={durationMin}
                  onChange={(event) => setDurationMin(event.target.value)}
                  type="number"
                  min={1}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                <span>Порядок сортування</span>
                <input
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  type="number"
                  min={0}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                />
              </label>
              <label className="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 sm:col-span-2 xl:col-span-1">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(event) => setIsPublished(event.target.checked)}
                  className="size-4 rounded border-white/20 bg-white/5"
                />
                Опубліковано
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={saveModule}
            disabled={isPending}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            Зберегти модуль і тест
          </button>

          {notice ? <p className="mt-4 text-sm text-emerald-300">{notice}</p> : null}
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </article>

        <article className="card xl:order-1 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <PackagePlus className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Конструктор блоків</p>
                  <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Матеріал модуля</h2>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Додавайте нові секції, міняйте їх місцями, редагуйте поля й будуйте модуль так, як його побачить
                користувач на фронті.
              </p>
            </div>

            <div className="w-full rounded-full border border-white/[0.08] bg-[rgba(8,10,18,0.28)] px-3 py-1.5 text-center text-xs font-semibold text-slate-500 sm:w-auto">
              Візуальний режим
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-white/[0.08] bg-[rgba(8,10,18,0.22)] p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {BLOCK_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => addBlock(option.type)}
                    className="focus-ring h-full rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,10,18,0.08))] p-4 text-left transition hover:border-[rgba(40,178,158,0.26)] hover:bg-[linear-gradient(180deg,rgba(40,178,158,0.12),rgba(255,255,255,0.02))]"
                  >
                    <div className="inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                      <Icon className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                    </div>
                    <p className="mt-3 font-medium text-slate-100">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {blocks.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/[0.08] bg-[rgba(8,10,18,0.2)] px-6 py-12 text-center text-sm text-slate-500">
                У модулі ще немає блоків. Почніть із відео, тексту або каталогу товарів.
              </div>
            ) : null}

            {blocks.map((block, index) => {
              const blockMeta = getBlockMeta(block.type);
              const BlockIcon = blockMeta.icon;
              const isDropTarget = dragOverBlockIndex === index && draggedBlockIndex !== null && draggedBlockIndex !== index;
              const isDraggedBlock = draggedBlockIndex === index;

              return (
                <section
                  key={`${block.type}-${index}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverBlockIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();

                    if (draggedBlockIndex === null) {
                      return;
                    }

                    moveBlockToIndex(draggedBlockIndex, index);
                    setDraggedBlockIndex(null);
                    setDragOverBlockIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedBlockIndex(null);
                    setDragOverBlockIndex(null);
                  }}
                  className={`overflow-hidden rounded-[30px] border p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition ${
                    isDropTarget
                      ? "border-[rgba(40,178,158,0.36)] bg-[linear-gradient(180deg,rgba(40,178,158,0.12),rgba(255,255,255,0.02))]"
                      : isDraggedBlock
                        ? "border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] opacity-80"
                        : "border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,18,0.14))]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        draggable
                        onDragStart={(event) => {
                          setDraggedBlockIndex(index);
                          setDragOverBlockIndex(index);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(index));
                        }}
                        onDragEnd={() => {
                          setDraggedBlockIndex(null);
                          setDragOverBlockIndex(null);
                        }}
                        className="focus-ring inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-300 active:cursor-grabbing"
                        title="Перетягніть блок"
                      >
                        <GripVertical className="size-5" aria-hidden="true" />
                      </div>
                      <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                        <BlockIcon className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Блок {index + 1} · {blockMeta.label}
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-100">{block.title || "Без назви"}</p>
                      </div>
                    </div>

                    <BlockToolbar
                      canMoveUp={index > 0}
                      canMoveDown={index < blocks.length - 1}
                      onMoveUp={() => moveBlock(index, "up")}
                      onMoveDown={() => moveBlock(index, "down")}
                      onDelete={() => removeBlock(index)}
                    />
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/[0.06] bg-[rgba(8,10,18,0.2)] p-4 sm:p-5">
                    <div className="grid gap-3">
                    <input
                      value={block.title}
                      onChange={(event) => replaceBlock(index, { ...block, title: event.target.value })}
                      placeholder="Заголовок блоку"
                      className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    />

                    {block.type === "video" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <select
                          value={block.provider ?? "youtube"}
                          onChange={(event) => replaceBlock(index, { ...block, provider: event.target.value })}
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                          <option value="html5">HTML5 / direct</option>
                        </select>
                        <input
                          value={block.url}
                          onChange={(event) => replaceBlock(index, { ...block, url: event.target.value })}
                          placeholder="URL відео"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                        />
                      </div>
                    ) : null}

                    {block.type === "pdf" ? (
                      <input
                        value={block.url}
                        onChange={(event) => replaceBlock(index, { ...block, url: event.target.value })}
                        placeholder="URL PDF"
                        className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                      />
                    ) : null}

                    {block.type === "image" ? (
                      <div className="grid gap-3 md:grid-cols-2 md:items-start">
                        <AdminImageField
                          value={block.url}
                          onChange={(nextUrl) => replaceBlock(index, { ...block, url: nextUrl })}
                          folder="modules"
                          placeholder="URL зображення"
                        />
                        <input
                          value={block.caption ?? ""}
                          onChange={(event) => replaceBlock(index, { ...block, caption: event.target.value })}
                          placeholder="Підпис до зображення"
                          className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                        />
                      </div>
                    ) : null}

                    {block.type === "text" ? (
                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <TextToolbarButton
                            label="H3"
                            icon={Heading3}
                            onClick={() => wrapTextSelection(index, "<h3>", "</h3>", "Підзаголовок")}
                          />
                          <TextToolbarButton
                            label="Жирний"
                            icon={Bold}
                            onClick={() => wrapTextSelection(index, "<strong>", "</strong>", "Важливий акцент")}
                          />
                          <TextToolbarButton
                            label="Цитата"
                            icon={Quote}
                            onClick={() =>
                              wrapTextSelection(index, "<blockquote><p>", "</p></blockquote>", "Цитата або важливе пояснення")
                            }
                          />
                          <TextToolbarButton
                            label="Список"
                            icon={ListChecks}
                            onClick={() => insertListIntoText(index)}
                          />
                          <TextToolbarButton
                            label="Абзац"
                            icon={FileText}
                            onClick={() => wrapTextSelection(index, "<p>", "</p>", "Новий абзац")}
                          />
                        </div>
                        <textarea
                          ref={(element) => {
                            textAreaRefs.current[index] = element;
                          }}
                          value={block.html}
                          onChange={(event) => replaceBlock(index, { ...block, html: event.target.value })}
                          rows={10}
                          className="focus-ring min-h-[240px] w-full rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                          spellCheck={false}
                        />
                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          Для цього блоку можна вставляти як звичайний текст, так і HTML на кшталт <code>{"<p>"}</code>, <code>{"<h3>"}</code>, <code>{"<ul>"}</code>.
                        </p>
                        <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.32)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Живий перегляд</p>
                          <div
                            className="mt-4 text-sm leading-7 text-slate-200 [&_blockquote]:border-l-2 [&_blockquote]:border-[rgba(40,178,158,0.4)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-[var(--font-heading)] [&_h3]:text-2xl [&_li]:mb-1 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{
                              __html: block.html || "<p>Додайте текст, щоб побачити попередній перегляд.</p>"
                            }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {block.type === "facts" ? (
                      <div>
                        <textarea
                          value={block.items.join("\n")}
                          onChange={(event) => replaceBlock(index, { ...block, items: splitLines(event.target.value) })}
                          rows={8}
                          className="focus-ring min-h-[200px] w-full rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                          placeholder="Кожен новий рядок = окремий факт"
                        />
                        <p className="mt-2 text-xs leading-6 text-slate-500">Один рядок дорівнює одному факту або тезі.</p>
                      </div>
                    ) : null}

                    {block.type === "productCatalog" ? (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 rounded-[22px] bg-[rgba(8,10,18,0.22)] px-4 py-4 ring-1 ring-inset ring-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-100">Товарні картки</p>
                            <p className="mt-1 text-xs leading-6 text-slate-500">
                              Тут можна редагувати моделі, короткі описи, характеристики, переваги та кольори.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addCatalogProduct(index)}
                            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
                          >
                            <Plus className="size-4" aria-hidden="true" />
                            Додати модель
                          </button>
                        </div>

                        {block.products.map((product, productIndex) => (
                          <details
                            key={`${product.slug}-${productIndex}`}
                            open
                            className="rounded-[24px] bg-[rgba(8,10,18,0.3)] p-4 ring-1 ring-inset ring-white/[0.06]"
                          >
                            <summary className="flex cursor-pointer list-none flex-col gap-3 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="font-medium text-slate-100">{product.title || `Модель ${productIndex + 1}`}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{product.slug}</p>
                              </div>

                              <BlockToolbar
                                canMoveUp={productIndex > 0}
                                canMoveDown={productIndex < block.products.length - 1}
                                onMoveUp={() => moveCatalogProduct(index, productIndex, "up")}
                                onMoveDown={() => moveCatalogProduct(index, productIndex, "down")}
                                onDelete={() => removeCatalogProduct(index, productIndex)}
                              />
                            </summary>

                            <div className="mt-4 grid gap-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <input
                                  value={product.title}
                                  onChange={(event) =>
                                    updateCatalogProduct(index, productIndex, (current) => ({
                                      ...current,
                                      title: event.target.value
                                    }))
                                  }
                                  placeholder="Назва моделі"
                                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                />
                                <input
                                  value={product.slug}
                                  onChange={(event) =>
                                    updateCatalogProduct(index, productIndex, (current) => ({
                                      ...current,
                                      slug: event.target.value
                                    }))
                                  }
                                  placeholder="Slug моделі"
                                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                />
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <input
                                  value={product.family ?? ""}
                                  onChange={(event) =>
                                    updateCatalogProduct(index, productIndex, (current) => ({
                                      ...current,
                                      family: event.target.value
                                    }))
                                  }
                                  placeholder="Сімейство / серія"
                                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                />
                                <input
                                  value={product.summary ?? ""}
                                  onChange={(event) =>
                                    updateCatalogProduct(index, productIndex, (current) => ({
                                      ...current,
                                      summary: event.target.value
                                    }))
                                  }
                                  placeholder="Короткий summary"
                                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                />
                              </div>

                              <textarea
                                value={product.overview.join("\n")}
                                onChange={(event) =>
                                  updateCatalogProduct(index, productIndex, (current) => ({
                                    ...current,
                                    overview: splitLines(event.target.value)
                                  }))
                                }
                                rows={6}
                                placeholder="Основні характеристики. Кожен рядок = окремий пункт."
                                className="focus-ring rounded-[22px] border border-white/10 bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                              />

                              <textarea
                                value={product.highlights.join("\n")}
                                onChange={(event) =>
                                  updateCatalogProduct(index, productIndex, (current) => ({
                                    ...current,
                                    highlights: splitLines(event.target.value)
                                  }))
                                }
                                rows={6}
                                placeholder="Переваги, УТП, сценарії консультації. Кожен рядок = окремий пункт."
                                className="focus-ring rounded-[22px] border border-white/10 bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                              />

                              <div className="border-t border-white/[0.06] pt-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="font-medium text-slate-100">Кольори</p>
                                    <p className="mt-1 text-xs leading-6 text-slate-500">
                                      Для кожного кольору можна окремо вказати рендер, підпис і основний варіант.
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addCatalogColor(index, productIndex)}
                                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
                                  >
                                    <Plus className="size-3.5" aria-hidden="true" />
                                    Додати колір
                                  </button>
                                </div>

                                <div className="mt-4 overflow-hidden rounded-[22px] bg-[rgba(8,10,18,0.2)] ring-1 ring-inset ring-white/[0.06]">
                                  {product.colors.map((color, colorIndex) => (
                                    <div
                                      key={`${product.slug}-color-${colorIndex}`}
                                      className={`${colorIndex > 0 ? "border-t border-white/[0.06]" : ""} px-4 py-4`}
                                    >
                                      <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                                        <input
                                          value={color.label}
                                          onChange={(event) =>
                                            updateCatalogColor(index, productIndex, colorIndex, {
                                              label: event.target.value
                                            })
                                          }
                                          placeholder="Назва кольору"
                                          className="focus-ring rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                        />
                                        <AdminImageField
                                          value={color.imageUrl}
                                          onChange={(nextUrl) =>
                                            updateCatalogColor(index, productIndex, colorIndex, {
                                              imageUrl: nextUrl
                                            })
                                          }
                                          folder="modules"
                                          placeholder="URL рендера кольору"
                                        />
                                      </div>

                                      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
                                        <input
                                          value={color.caption}
                                          onChange={(event) =>
                                            updateCatalogColor(index, productIndex, colorIndex, {
                                              caption: event.target.value
                                            })
                                          }
                                          placeholder="Підпис до кольору"
                                          className="focus-ring rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                        />
                                        <label className="inline-flex items-center gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                                          <input
                                            type="checkbox"
                                            checked={color.default === true}
                                            onChange={(event) =>
                                              updateCatalogColor(index, productIndex, colorIndex, {
                                                default: event.target.checked
                                              })
                                            }
                                            className="size-4 rounded border-white/20 bg-white/5"
                                          />
                                          Основний
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => removeCatalogColor(index, productIndex, colorIndex)}
                                          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[16px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 md:w-auto"
                                        >
                                          <Trash2 className="size-4" aria-hidden="true" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : null}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-[rgba(8,10,18,0.2)] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                    <TestTube2 className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Редактор тесту</p>
                    <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Питання без сирого JSON</h2>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  Тут ми вже керуємо самим тестом: формулюванням запитань, типом відповіді, варіантами і правильними
                  відповідями. Усе зберігається разом із модулем з цієї ж сторінки.
                </p>
              </div>

              <div className="w-full rounded-full border border-white/[0.08] bg-[rgba(8,10,18,0.28)] px-3 py-1.5 text-center text-xs font-semibold text-slate-500 sm:w-auto">
                {quizQuestionsCount} питань
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={() => addQuizQuestion("SINGLE")}
                className="focus-ring rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,10,18,0.08))] px-4 py-4 text-left transition hover:border-[rgba(40,178,158,0.26)] hover:bg-[linear-gradient(180deg,rgba(40,178,158,0.12),rgba(255,255,255,0.02))]"
              >
                <p className="font-medium text-slate-100">Один правильний варіант</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Класичне питання з одним правильним вибором.</p>
              </button>
              <button
                type="button"
                onClick={() => addQuizQuestion("MULTIPLE")}
                className="focus-ring rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,10,18,0.08))] px-4 py-4 text-left transition hover:border-[rgba(40,178,158,0.26)] hover:bg-[linear-gradient(180deg,rgba(40,178,158,0.12),rgba(255,255,255,0.02))]"
              >
                <p className="font-medium text-slate-100">Кілька правильних відповідей</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Добре працює для списків властивостей, переваг і сценаріїв.</p>
              </button>
              <button
                type="button"
                onClick={() => addQuizQuestion("TRUE_FALSE")}
                className="focus-ring rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,10,18,0.08))] px-4 py-4 text-left transition hover:border-[rgba(40,178,158,0.26)] hover:bg-[linear-gradient(180deg,rgba(40,178,158,0.12),rgba(255,255,255,0.02))]"
              >
                <p className="font-medium text-slate-100">True / False</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Швидка перевірка фактів, міфів і простих тверджень.</p>
              </button>
              <button type="button" onClick={() => addQuizQuestion("MATCHING")}
                className="focus-ring rounded-[22px] border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-left transition hover:border-[rgba(40,178,158,0.26)]">
                <p className="font-medium text-slate-100">Встановити відповідності</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Зіставте кожен лівий пункт з правильним правим варіантом.</p>
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {quizQuestions.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/[0.08] bg-[rgba(8,10,18,0.2)] px-6 py-10 text-center text-sm text-slate-500">
                  У тесті ще немає запитань. Додайте перше питання одним із чотирьох шаблонів вище.
                </div>
              ) : null}

              {quizQuestions.map((question, questionIndex) => (
                <section
                  key={question.clientId}
                  className="rounded-[26px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,10,18,0.12))] p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Питання {questionIndex + 1} · {question.type === "SINGLE" ? "Single" : question.type === "MULTIPLE" ? "Multiple" : question.type === "MATCHING" ? "Відповідності" : "True / False"}
                      </p>
                      <p className="mt-2 text-base font-medium text-slate-100">{question.question || "Нове питання без тексту"}</p>
                    </div>

                    <BlockToolbar
                      canMoveUp={questionIndex > 0}
                      canMoveDown={questionIndex < quizQuestions.length - 1}
                      onMoveUp={() => moveQuizQuestion(questionIndex, "up")}
                      onMoveDown={() => moveQuizQuestion(questionIndex, "down")}
                      onDelete={() => removeQuizQuestion(questionIndex)}
                    />
                  </div>

                  <div className="mt-4 grid gap-3">
                    <textarea
                      value={question.question}
                      onChange={(event) =>
                        updateQuizQuestion(questionIndex, (current) => ({
                          ...current,
                          question: event.target.value
                        }))
                      }
                      rows={3}
                      placeholder="Текст питання"
                      className="focus-ring rounded-[20px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500"
                    />

                    <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                      <select
                        value={question.type}
                        onChange={(event) =>
                          updateQuizQuestion(questionIndex, (current) => {
                            const nextType = event.target.value as EditableQuestionType;

                            if (nextType === current.type) {
                              return current;
                            }

                            return {
                              ...current,
                              type: nextType,
                              options: current.options
                            };
                          })
                        }
                        className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                      >
                        <option value="SINGLE">Один правильний варіант</option>
                        <option value="MULTIPLE">Кілька правильних</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="MATCHING">Відповідності</option>
                      </select>

                      {question.type === "TRUE_FALSE" ? (
                        <div className="rounded-[20px] border border-white/[0.08] bg-[rgba(8,10,18,0.28)] p-4">
                          <p className="text-sm font-medium text-slate-100">Правильна відповідь</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <label className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                              <input
                                type="radio"
                                name={`true-false-${question.clientId}`}
                                checked={question.correctBooleanValue === true}
                                onChange={() =>
                                  updateQuizQuestion(questionIndex, (current) => ({
                                    ...current,
                                    correctBooleanValue: true
                                  }))
                                }
                              />
                              True
                            </label>
                            <label className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                              <input
                                type="radio"
                                name={`true-false-${question.clientId}`}
                                checked={question.correctBooleanValue === false}
                                onChange={() =>
                                  updateQuizQuestion(questionIndex, (current) => ({
                                    ...current,
                                    correctBooleanValue: false
                                  }))
                                }
                              />
                              False
                            </label>
                          </div>
                          <p className="mt-3 text-xs leading-6 text-slate-500">
                            Для цього типу варіанти фіксовані, тому ми керуємо тільки правильним значенням.
                          </p>
                        </div>
                      ) : question.type === "MATCHING" ? (
                        <div className="min-w-0 space-y-4 rounded-[20px] border border-white/[0.08] bg-[rgba(8,10,18,0.28)] p-4">
                          <p className="text-sm text-slate-300">Заповніть обидва списки та оберіть правильну відповідність для кожного лівого пункту.</p>
                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <fieldset className="min-w-0 space-y-3">
                              <legend className="mb-3 text-sm font-semibold text-white">Ліві пункти</legend>
                              {question.options.map((option, optionIndex) => <div key={`${question.clientId}-left-${optionIndex}`} className="space-y-2 rounded-xl border border-white/10 p-3">
                                <label className="grid gap-2 text-sm text-slate-300">
                                  <span>Лівий пункт {optionIndex + 1}</span>
                                  <input value={option} onChange={(event) => updateQuizOption(questionIndex, optionIndex, event.target.value)}
                                    className="focus-ring rounded-xl border border-white/10 px-3 py-2 text-white" />
                                </label>
                                <label className="grid gap-2 text-sm text-slate-300">
                                  <span>Правильна відповідність {optionIndex + 1}</span>
                                  <select value={question.correctMatchingIndices[optionIndex] ?? -1}
                                    onChange={(event) => updateQuizQuestion(questionIndex, (current) => ({ ...current,
                                      correctMatchingIndices: current.options.map((_, index) => index === optionIndex ? Number(event.target.value) : current.correctMatchingIndices[index] ?? -1) }))}
                                    className="focus-ring rounded-xl border border-white/10 px-3 py-2 text-white">
                                    <option value={-1}>Оберіть відповідність</option>
                                    {question.matchingRightOptions.map((right, rightIndex) => <option key={rightIndex} value={rightIndex}>{rightIndex + 1}. {right || "Порожній варіант"}</option>)}
                                  </select>
                                </label>
                                <button type="button" onClick={() => removeMatchingOption(questionIndex, "left", optionIndex)} disabled={question.options.length <= 2}
                                  className="focus-ring rounded-full px-3 py-2 text-xs text-rose-200 disabled:opacity-40">Видалити лівий пункт {optionIndex + 1}</button>
                              </div>)}
                              <button type="button" onClick={() => updateQuizQuestion(questionIndex, (current) => ({ ...current,
                                options: [...current.options, ""], correctMatchingIndices: [...current.correctMatchingIndices, -1] }))}
                                className="focus-ring rounded-full border border-white/10 px-3 py-2 text-sm text-white">Додати лівий пункт</button>
                            </fieldset>
                            <fieldset className="min-w-0 space-y-3">
                              <legend className="mb-3 text-sm font-semibold text-white">Праві варіанти</legend>
                              {question.matchingRightOptions.map((option, optionIndex) => <div key={`${question.clientId}-right-${optionIndex}`} className="space-y-2 rounded-xl border border-white/10 p-3">
                                <label className="grid gap-2 text-sm text-slate-300">
                                  <span>Правий варіант {optionIndex + 1}</span>
                                  <input value={option} onChange={(event) => updateQuizQuestion(questionIndex, (current) => ({ ...current,
                                    matchingRightOptions: current.matchingRightOptions.map((value, index) => index === optionIndex ? event.target.value : value) }))}
                                    className="focus-ring rounded-xl border border-white/10 px-3 py-2 text-white" />
                                </label>
                                <button type="button" onClick={() => removeMatchingOption(questionIndex, "right", optionIndex)} disabled={question.matchingRightOptions.length <= 2}
                                  className="focus-ring rounded-full px-3 py-2 text-xs text-rose-200 disabled:opacity-40">Видалити правий варіант {optionIndex + 1}</button>
                              </div>)}
                              <button type="button" onClick={() => updateQuizQuestion(questionIndex, (current) => ({ ...current,
                                matchingRightOptions: [...current.matchingRightOptions, ""] }))}
                                className="focus-ring rounded-full border border-white/10 px-3 py-2 text-sm text-white">Додати правий варіант</button>
                            </fieldset>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[20px] border border-white/[0.08] bg-[rgba(8,10,18,0.28)] p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100">Варіанти відповідей</p>
                              <p className="mt-1 text-xs leading-6 text-slate-500">
                                {question.type === "SINGLE"
                                  ? "Позначте один правильний варіант радіокнопкою."
                                  : "Позначте всі правильні варіанти чекбоксами."}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addQuizOption(questionIndex)}
                              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-100 sm:w-auto"
                            >
                              <Plus className="size-3.5" aria-hidden="true" />
                              Додати варіант
                            </button>
                          </div>

                          <div className="mt-4 space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={`${question.clientId}-option-${optionIndex}`}
                                className="grid gap-3 rounded-[18px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] p-3 lg:grid-cols-[auto_minmax(0,1fr)_auto]"
                              >
                                <label className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
                                  <input
                                    type={question.type === "SINGLE" ? "radio" : "checkbox"}
                                    name={`question-${question.clientId}`}
                                    checked={
                                      question.type === "SINGLE"
                                        ? question.correctSingleIndex === optionIndex
                                        : question.correctMultipleIndices.includes(optionIndex)
                                    }
                                    onChange={() => {
                                      if (question.type === "SINGLE") {
                                        updateQuizQuestion(questionIndex, (current) => ({
                                          ...current,
                                          correctSingleIndex: optionIndex
                                        }));
                                        return;
                                      }

                                      toggleMultipleCorrectAnswer(questionIndex, optionIndex);
                                    }}
                                  />
                                  {question.type === "SINGLE" ? "Правильна" : "У відповіді"}
                                </label>

                                <input
                                  value={option}
                                  onChange={(event) => updateQuizOption(questionIndex, optionIndex, event.target.value)}
                                  placeholder={`Варіант ${optionIndex + 1}`}
                                  className="focus-ring rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeQuizOption(questionIndex, optionIndex)}
                                  disabled={question.options.length <= 2}
                                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[16px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <details className="mt-6 rounded-[24px] border border-white/[0.08] bg-[rgba(8,10,18,0.3)] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">Технічний перегляд JSON</summary>
            <textarea
              value={JSON.stringify(blocks, null, 2)}
              readOnly
              rows={18}
              className="mt-4 min-h-[300px] w-full rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 font-mono text-sm leading-7 text-white"
              spellCheck={false}
            />
          </details>

          <details className="mt-4 rounded-[24px] border border-white/[0.08] bg-[rgba(8,10,18,0.3)] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">Технічний перегляд питань тесту</summary>
            <textarea
              value={JSON.stringify(serializeQuizQuestions(quizQuestions), null, 2)}
              readOnly
              rows={14}
              className="mt-4 min-h-[240px] w-full rounded-[22px] border border-white/[0.08] bg-[rgba(8,10,18,0.72)] px-4 py-4 font-mono text-sm leading-7 text-white"
              spellCheck={false}
            />
          </details>
        </article>
      </section>
    </section>
  );
}
