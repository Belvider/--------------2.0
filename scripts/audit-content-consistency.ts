import { prisma } from "@/lib/prisma";
import {
  auditDatabaseModuleContent,
  auditPlaceholderCategories,
  auditPlaceholderModules,
  auditSourceContentFiles
} from "@/lib/content-audit";

function printVisibleIssues(scope: string, issues: Awaited<ReturnType<typeof auditDatabaseModuleContent>>) {
  if (issues.length === 0) {
    console.log(`${scope}: підозрілих перехресних заголовків або підписів не знайдено.`);
    return;
  }

  console.log(`${scope}: знайдено ${issues.length} потенційних проблем.`);
  for (const issue of issues) {
    console.log(`- [${issue.scope}] ${issue.location}`);
    console.log(`  field: ${issue.field}`);
    console.log(`  unexpected: ${issue.unexpected.join(", ")}`);
    console.log(`  text: ${issue.text}`);
  }
}

async function main() {
  const [sourceIssues, databaseIssues, placeholderModules, placeholderCategories] = await Promise.all([
    Promise.resolve(auditSourceContentFiles()),
    auditDatabaseModuleContent(prisma),
    auditPlaceholderModules(prisma),
    auditPlaceholderCategories(prisma)
  ]);

  printVisibleIssues("Source audit", sourceIssues);
  printVisibleIssues("Database audit", databaseIssues);

  if (placeholderModules.length > 0) {
    console.log(`Placeholder modules: знайдено ${placeholderModules.length} модулів-заглушок.`);
    for (const moduleItem of placeholderModules) {
      console.log(`- ${moduleItem.brand} / ${moduleItem.category} / ${moduleItem.title}`);
      console.log(`  signals: ${moduleItem.signals.join(", ")}`);
    }
  } else {
    console.log("Placeholder modules: заглушок не знайдено.");
  }

  if (placeholderCategories.length > 0) {
    console.log(`Placeholder categories: знайдено ${placeholderCategories.length} категорій, де весь published-контент шаблонний.`);
    for (const category of placeholderCategories) {
      console.log(`- ${category.brand} / ${category.category}`);
      console.log(`  modules: ${category.modules.map((moduleItem) => moduleItem.title).join(" | ")}`);
    }
  } else {
    console.log("Placeholder categories: категорій із суцільним шаблонним контентом не знайдено.");
  }

  if (
    sourceIssues.length > 0 ||
    databaseIssues.length > 0 ||
    placeholderModules.length > 0 ||
    placeholderCategories.length > 0
  ) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
