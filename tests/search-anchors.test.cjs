const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getModuleBlockAnchor, getProductAnchor, getProductDetailAnchor, getFactAnchor,
  getPortalCardAnchor, getPortalCardItemAnchor, findModuleBlockIndexForAnchor,
  prepareSearchableHtml, stripSearchableHtml
} = require("../lib/content-anchors.ts");

test("index and renderer use positional targets independent of labels and legacy slugs", () => {
  const block = getModuleBlockAnchor(42, 2);
  assert.equal(block, "module-42-topic-3");
  const product = getProductAnchor(block, 4);
  assert.equal(product, "module-42-topic-3-product-5");
  assert.equal(getProductDetailAnchor(product, "highlight", 7), "module-42-topic-3-product-5-highlight-8");
  assert.equal(getFactAnchor(block, 1), "module-42-topic-3-fact-2");
  assert.equal(getPortalCardItemAnchor(getPortalCardAnchor("accessories", 1), 2), "portal-accessories-card-2-item-3");
});

test("HTML paragraphs, headings, list points and comparison rows get the exact searchable targets", () => {
  const source = '<h3>Живлення</h3><p>ККД &amp; запас&nbsp;25%.</p><ul><li><p>USB&#8209;C</p></li><li>До 240 Вт</li></ul><table><tr><th>Модель</th><th>Потужність</th></tr><tr><td>Станція</td><td><p>1&nbsp;кВт</p></td></tr></table>';
  const result = prepareSearchableHtml(source, "module-8-topic-2");
  assert.deepEqual(result.fragments.map(({ text }) => text), ["Живлення", "ККД & запас 25%.", "USB‑C", "До 240 Вт", "Модель Потужність", "Станція 1 кВт"]);
  for (const [index, fragment] of result.fragments.entries()) {
    assert.equal(fragment.anchor, `module-8-topic-2-text-${index + 1}`);
    assert.ok(result.html.includes(`id="${fragment.anchor}" data-material-anchor="${fragment.anchor}"`));
    assert.equal(fragment.title, "Живлення");
  }
  assert.equal(result.html.includes("<span"), false, "no invalid spans are inserted into tables");
  assert.deepEqual(prepareSearchableHtml(source, "module-8-topic-2"), result);
});

test("authored anchors survive while indexed links retain their generated targets", () => {
  const result = prepareSearchableHtml('<h2 id="battery">Батарея</h2><p id=runtime>Час роботи</p>', "module-8-topic-1");
  assert.ok(result.html.includes('id="battery" data-material-anchor="module-8-topic-1-text-1"'));
  assert.ok(result.html.includes('id=runtime data-material-anchor="module-8-topic-1-text-2"'));
  assert.equal((result.html.match(/id="battery"/g) ?? []).length, 1);
});

test("search copy excludes scripts, style, URL attributes, comments and hidden nodes", () => {
  const source = '<!-- internal migration --><style>.secret { color:red }</style><script>alert("private")</script><template><p>Template</p></template><p>Visible <a href="https://secret.example/path">Apple &trade;</a><span hidden>Hidden</span><span aria-hidden="true">Decorative</span> &#x1F34D;</p>';
  assert.equal(stripSearchableHtml(source), "Visible Apple ™ 🍍");
  const result = prepareSearchableHtml(source, "module-1-topic-1");
  assert.deepEqual(result.fragments.map(({ text }) => text), ["Visible Apple ™ 🍍"]);
  assert.equal(result.fragments[0].anchor, "module-1-topic-1-text-1");
  assert.ok(result.html.includes('href="https://secret.example/path"'), "the renderer does not rewrite authored link destinations");
});

test("bare imported text stays searchable and calculator markers remain usable", () => {
  const result = prepareSearchableHtml("Потреби клієнта &mdash; найперше", "module-1-topic-1");
  assert.deepEqual(result.fragments, [{ anchor: "module-1-topic-1", text: "Потреби клієнта — найперше" }]);
  const marked = prepareSearchableHtml('<p>Потужність</p><!-- power-station-calculator --><p>Запас</p>', "module-1-topic-2");
  assert.ok(marked.html.includes("<!-- power-station-calculator -->"));
  assert.equal(marked.fragments[1].anchor, "module-1-topic-2-text-2");
});

test("nested hidden ancestors exclude every descendant without leaking trailing private text", () => {
  assert.equal(stripSearchableHtml('<div hidden><div>one</div>private</div><p>public</p>'), "public");
  assert.equal(stripSearchableHtml('<div aria-hidden="true"><section><div>one</div></section>private</div><p>public</p>'), "public");
  assert.equal(stripSearchableHtml('<p>Before</p><div aria-hidden=true><p>Hidden</p>private</div><p>After</p>'), "Before After");
  assert.equal(stripSearchableHtml('<script>const html = "<p>Private</p>";</script><style>p::before { content: "secret"; }</style><p>public</p>'), "public");
  assert.equal(stripSearchableHtml('<template><template>one</template>private</template><p>public</p>'), "public");
  assert.deepEqual(prepareSearchableHtml('<p>Before</p><div aria-hidden=true><p>Hidden</p>private</div><p>After</p>', "module-1-topic-1").fragments.map(({ text }) => text), ["Before", "After"]);
});

test("angle brackets in quoted attributes keep markup intact and do not become search copy", () => {
  const source = '<p title="A > B">Visible</p>';
  const result = prepareSearchableHtml(source, "module-1-topic-1");
  assert.equal(result.html, '<p title="A > B" id="module-1-topic-1-text-1" data-material-anchor="module-1-topic-1-text-1">Visible</p>');
  assert.equal(stripSearchableHtml(source), "Visible");
  assert.deepEqual(result.fragments, [{ anchor: "module-1-topic-1-text-1", text: "Visible" }]);
  const withScript = '<div><script>const example = "</div><p>Private</p>";</script><p data-note=\'A < B > C\'>Public</p></div>';
  assert.equal(stripSearchableHtml(withScript), "Public");
  assert.deepEqual(prepareSearchableHtml(withScript, "module-1-topic-1").fragments.map(({ text }) => text), ["Public"]);
});

test("wide imported tables scroll inside their own region without changing exact row links", () => {
  const table = '<table style="min-width:620px"><tr><th>Модель</th><th>Потужність</th></tr><tr><td>Станція</td><td>1 кВт</td></tr></table>';
  const plain = prepareSearchableHtml(`<p>Порівняння</p>${table}<p>Підсумок</p>`, "module-1-topic-4");
  const authored = prepareSearchableHtml(`<p>Порівняння</p><div class="existing table-scroll compact"><section>${table}</section></div><p>Підсумок</p>`, "module-1-topic-4");
  assert.equal((plain.html.match(/class="table-scroll"/g) ?? []).length, 1);
  assert.ok(plain.html.includes('<div class="table-scroll" role="region" aria-label="Таблиця навчального матеріалу" tabindex="0"><table style="min-width:620px">'));
  assert.ok(plain.html.includes('</table></div><p id="module-1-topic-4-text-4"'));
  assert.equal((authored.html.match(/\btable-scroll\b/g) ?? []).length, 1, "authored scroll ancestors remain intact, including a nested table");
  assert.deepEqual(plain.fragments, authored.fragments, "wrapping must not renumber searchable targets or alter their copy");
  assert.equal(plain.fragments[1].anchor, "module-1-topic-4-text-2");
  assert.ok(plain.html.includes('<tr id="module-1-topic-4-text-2" data-material-anchor="module-1-topic-4-text-2">'));
  assert.ok(authored.html.includes('<div class="existing table-scroll compact"><section><table style="min-width:620px">'));
});

test("generated, legacy product and authored targets resolve to their actual hidden block", () => {
  const blocks = [
    { type: "facts", title: "Вступ", items: ["Початок"] },
    { type: "text", title: "Навчання", html: '<h3 id="battery">Батарея</h3><p id=runtime>Час роботи</p>' },
    { type: "productCatalog", title: "Моделі", products: [{ slug: "old-phone", title: "Phone", overview: [], highlights: [], colors: [] }] }
  ];
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "module-42-topic-3-product-1-highlight-8"), 2);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "old-phone"), 2);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "battery"), 1);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "runtime"), 1);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "module-42-topic-30-product-1"), -1);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "module-43-topic-1"), -1);
  assert.equal(findModuleBlockIndexForAnchor(42, blocks, "unknown"), -1);
});
