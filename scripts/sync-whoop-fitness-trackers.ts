import { PrismaClient, QuestionType } from "@prisma/client";
import whoopFitnessTrackersContent from "../lib/content/whoop-fitness-trackers";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { whoopFitnessTrackersCatalogBlocks, whoopFitnessTrackersFoundationBlocks } = whoopFitnessTrackersContent;

function whoopFitnessTrackersFoundationQuestions() {
  return [
    {
      question: "Що найкраще описує саму концепцію WHOOP?",
      type: QuestionType.SINGLE,
      options: [
        "Смарт-годинник з великим екраном і GPS",
        "Система керування режимом і відновленням через біометрію та підписку",
        "Лише крокомір без застосунку",
        "Медичний діагностичний прилад"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть ключові метрики WHOOP із вашого матеріалу.",
      type: QuestionType.MULTIPLE,
      options: ["Recovery", "Strain", "Sleep", "Stress", "Face ID"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: WHOOP має екран і продається насамперед як класичний смарт-годинник.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Який важливий нюанс потрібно чесно проговорити під час продажу WHOOP?",
      type: QuestionType.SINGLE,
      options: [
        "Що продукт не потребує застосунку",
        "Що WHOOP продається через підписку і частина функцій залежить від плану",
        "Що браслет має великий AMOLED-екран",
        "Що всі функції є медичною діагностикою"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є сильним аргументом на користь WHOOP 5.0 / MG?",
      type: QuestionType.SINGLE,
      options: [
        "14+ днів батареї для постійного носіння",
        "Механічний безель",
        "Вбудований SIM-слот",
        "Обов'язковий GPS без телефона"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function whoopFitnessTrackersCatalogQuestions() {
  return [
    {
      question: "Яке покоління WHOOP у вашому матеріалі позиціонується як золота середина для більшості користувачів?",
      type: QuestionType.SINGLE,
      options: ["WHOOP 3.0", "WHOOP 4.0", "WHOOP 5.0", "WHOOP MG"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть функції, які відрізняють WHOOP MG від базового WHOOP 5.0 у вашому матеріалі.",
      type: QuestionType.MULTIPLE,
      options: ["ECG", "Blood Pressure Insights", "Irregular Rhythm Notifications", "Вбудований GPS"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: WHOOP 5.0 у вашому матеріалі має 14+ днів автономності.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який план WHOOP у вашому матеріалі додає Stress Monitor, Health Monitor і Healthspan / WHOOP Age?",
      type: QuestionType.SINGLE,
      options: ["WHOOP One", "WHOOP Peak", "WHOOP Life", "Усі однаково"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Кому з наведених клієнтів WHOOP підходить найкраще?",
      type: QuestionType.SINGLE,
      options: [
        "Тому, хто хоче смарт-годинник з екраном і навігацією",
        "Тому, хто хоче 24/7-аналітику відновлення, сну і режиму без екрану",
        "Тому, хто шукає лише бюджетний крокомір без підписки",
        "Тому, кому потрібен медичний тонометр"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

type ModuleBlueprint = {
  title: string;
  description: string;
  contentBlocks: ModuleContentBlock[];
  durationMin: number;
  sortOrder: number;
  questions: ReturnType<typeof whoopFitnessTrackersFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "fitness-trackers",
      brand: { slug: "whoop" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Whoop / fitness-trackers не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "WHOOP: метрики, підписка і логіка консультації",
      description:
        "Внутрішній конспект по WHOOP: концепція безекранного браслета, Recovery / Strain / Sleep, підписка, сильні сторони, обмеження і сценарії підбору.",
      contentBlocks: whoopFitnessTrackersFoundationBlocks,
      durationMin: 25,
      sortOrder: 1,
      questions: whoopFitnessTrackersFoundationQuestions()
    },
    {
      title: "WHOOP Strap 3.0, 4.0, 5.0, MG та плани членства",
      description:
        "Каталог поколінь WHOOP і членств: ключові відмінності між 3.0, 4.0, 5.0, MG, а також логіка вибору планів One, Peak і Life.",
      contentBlocks: whoopFitnessTrackersCatalogBlocks,
      durationMin: 31,
      sortOrder: 2,
      questions: whoopFitnessTrackersCatalogQuestions()
    }
  ];

  for (const blueprint of blueprints) {
    const existingByOrder = category.modules.find((module) => module.sortOrder === blueprint.sortOrder);

    if (existingByOrder) {
      await prisma.module.update({
        where: { id: existingByOrder.id },
        data: {
          title: blueprint.title,
          description: blueprint.description,
          contentBlocks: blueprint.contentBlocks,
          durationMin: blueprint.durationMin,
          sortOrder: blueprint.sortOrder,
          isPublished: true,
          questions: {
            deleteMany: {},
            create: blueprint.questions
          }
        }
      });

      continue;
    }

    await prisma.module.create({
      data: {
        categoryId: category.id,
        title: blueprint.title,
        description: blueprint.description,
        contentBlocks: blueprint.contentBlocks,
        durationMin: blueprint.durationMin,
        sortOrder: blueprint.sortOrder,
        isPublished: true,
        questions: {
          create: blueprint.questions
        }
      }
    });
  }

  console.log("Whoop fitness trackers content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
