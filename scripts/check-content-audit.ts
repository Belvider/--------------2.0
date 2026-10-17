import assert from "node:assert/strict";
import { auditDatabaseModuleContent } from "../lib/content-audit";

// Regression: portal mappings provide narrow source context, without disabling
// cross-brand detection in retail, other academy modules, or unknown mappings.
async function main() {
  const modules = [
    {
      id: 10, title: "ПриватБанк — розстрочка",
      category: { name: "Кредити та Фінанси", brand: { name: "PineApple Academy", slug: "pineapple-academy" } },
      contentBlocks: [{ type: "text", title: "ПриватБанк", html: "<h3>Monobank</h3>" }]
    },
    {
      id: 11, title: "JBL: акустика",
      category: { name: "Акустика", brand: { name: "JBL", slug: "jbl" } },
      contentBlocks: [{ type: "text", title: "Dyson", html: "<p>JBL</p>" }]
    },
    {
      id: 12, title: "Новий модуль",
      category: { name: "Аксесуари", brand: { name: "PineApple Academy", slug: "pineapple-academy" } },
      contentBlocks: [{ type: "text", title: "Belkin", html: "<p>Приклад</p>" }]
    }
  ];
  const client = {
    module: { findMany: async () => modules },
    appSetting: { findUnique: async () => ({ value: {
      "credit-privat24": 10,
      // A retail module must not inherit an academy context, even if a mapping
      // mistakenly points to it. Unknown keys must not enable another module.
      "service-warranty": 11,
      "unknown-accessory": 12
    } }) }
  } as unknown as Parameters<typeof auditDatabaseModuleContent>[0];
  const issues = await auditDatabaseModuleContent(client);
  assert.equal(issues.length, 3);
  assert.deepEqual(issues.map((issue) => issue.unexpected), [["Monobank"], ["Dyson"], ["Belkin"]]);
  assert.ok(!issues.some((issue) => issue.unexpected.includes("Privat")));
  console.log("Content audit regression passed: mapped context remains narrow; unrelated brands are detected.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
