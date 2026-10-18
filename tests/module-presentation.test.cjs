const test = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
// tsx uses the project's preserved JSX; Next normally supplies the JSX runtime.
global.React = React;
const { renderToStaticMarkup } = require("react-dom/server");
const { AppRouterContext } = require("next/dist/shared/lib/app-router-context.shared-runtime");

// Node has no CSS loader; preserve class names while exercising the actual JSX.
require.extensions[".css"] = (module) => {
  module.exports = { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
};
const { ModuleViewer } = require("../components/module/ModuleViewer.tsx");

function render(blocks) {
  return renderToStaticMarkup(React.createElement(
    AppRouterContext.Provider,
    { value: { refresh() {} } },
    React.createElement(ModuleViewer, { moduleId: 42, blocks, initialProgressPct: 0, hasQuiz: true })
  ));
}

test("each topic in the compact contents links to its rendered learning section", () => {
  const blocks = [
    { type: "text", title: "Вибір моделі", html: "<p>Спочатку з’ясуйте потреби клієнта.</p>" },
    { type: "text", title: "Нова техніка", html: "<p>Порівняйте характеристики.</p>" },
    { type: "facts", title: "Що перевірити", items: ["Стан корпусу", "Комплектацію"] }
  ];
  const html = render(blocks);
  for (let index = 1; index <= blocks.length; index += 1) {
    assert.ok(html.includes(`href="#module-42-topic-${index}"`));
    assert.ok(html.includes(`id="module-42-topic-${index}" tabindex="-1"`));
  }
  for (const block of blocks) assert.ok(html.includes(block.title));
  assert.equal(/>Текст<|>ТЕКСТ</.test(html), false);
  assert.ok(html.includes('aria-current="step"'));
  assert.ok(html.includes('aria-label="Переглянутий матеріал"'));
  assert.ok(html.indexOf("<aside") < html.indexOf('id="module-42-content"'), "module navigation comes before learning content in keyboard and reading order");
});

test("catalog preserves learning summary and available color controls without an empty image placeholder", () => {
  const html = render([{ type: "productCatalog", title: "Модельний ряд", products: [
    { slug: "example", title: "Модель (2026)", family: "Основна", summary: "Для щоденних завдань.", overview: ["Екран: 6 дюймів"], highlights: ["Поясніть відмінності екранів."], colors: [] },
    { slug: "example-pro", title: "Модель Pro (2026)", family: "Pro", overview: [], highlights: [], colors: [{ label: "Синій", caption: "Синій", imageUrl: "/images/example.jpg", default: true }] }
  ] }]);
  assert.ok(html.includes("Для щоденних завдань."));
  assert.ok(html.includes("Поясніть відмінності екранів."));
  assert.ok(html.includes('aria-pressed="true"'));
  assert.ok(html.includes('href="#example-pro"'));
  assert.equal(html.includes("Зображення не додано"), false);
  assert.equal(html.includes("Внутрішній конспект"), false);
});

test("empty material does not display a misleading page counter", () => {
  const html = render([]);
  assert.ok(html.includes("Навчальні матеріали ще не опубліковані."));
  assert.equal(html.includes("1 / 0"), false);
  assert.equal(html.includes('aria-label="Перехід між розділами"'), false);
});
