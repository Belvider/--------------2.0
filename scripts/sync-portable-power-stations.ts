import { PrismaClient, QuestionType } from "@prisma/client";
import portablePowerStationsContent from "../lib/content/portable-power-stations";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { portablePowerStationsCatalogBlocks, portablePowerStationsFoundationBlocks } = portablePowerStationsContent;

function portablePowerStationsFoundationQuestions() {
  return [
    {
      question: "Яка формула використовується для швидкого підбору потрібної ємності станції?",
      type: QuestionType.SINGLE,
      options: [
        "Wh = Вт + год + ККД",
        "Wh = (Вт × год) / ККД",
        "Wh = Вт / год",
        "Wh = пікова потужність × 2"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що потрібно уточнити в клієнта на старті консультації по зарядній станції?",
      type: QuestionType.MULTIPLE,
      options: [
        "Що саме буде живити",
        "На скільки годин потрібна автономність",
        "Чи планує підключати сонячні панелі",
        "Який улюблений колір корпусу"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: W і Wh означають одне й те саме.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Яка хімія АКБ у вашому матеріалі подається як безпечніша і довговічніша, але важча?",
      type: QuestionType.SINGLE,
      options: ["NMC", "LiFePO₄", "Ni-MH", "Lead Acid"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Чому для холодильника або насоса важливо перевіряти не лише Wh, а й W та пікову потужність?",
      type: QuestionType.SINGLE,
      options: [
        "Бо ці пристрої часто мають високий пусковий струм",
        "Бо їм не потрібна чиста синусоїда",
        "Бо вони заряджаються лише від USB-C",
        "Бо для них неважлива ємність станції"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function portablePowerStationsCatalogQuestions() {
  return [
    {
      question: "До якої лінійки у вашому матеріалі належать моделі RIVER і DELTA?",
      type: QuestionType.SINGLE,
      options: ["Bluetti", "EcoFlow", "Anker SOLIX", "Jackery"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель Bluetti у вашому матеріалі має IP65 пиловодо-захист?",
      type: QuestionType.SINGLE,
      options: ["EB3A", "AC2P", "AC240", "AC200L"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "True/False: Anker SOLIX F3800 у вашому матеріалі позиціонується як резерв для дому.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Jackery у вашому матеріалі масштабується до 12 кВт·год системно?",
      type: QuestionType.SINGLE,
      options: ["Explorer 500", "Explorer 1000 Plus", "Explorer 2000 Plus", "Жодна"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що в розширених таблицях потрібно перевіряти у PV-вході, окрім простої цифри у Вт?",
      type: QuestionType.MULTIPLE,
      options: [
        "Діапазон напруги",
        "Струм",
        "Тип роз’єму",
        "Колір дисплея"
      ],
      correctAnswer: { indices: [0, 1, 2] },
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
  questions: ReturnType<typeof portablePowerStationsFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "power-stations",
      brand: { slug: "portable-power" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію portable-power / power-stations не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Портативні зарядні станції: основи, розрахунок і логіка консультації",
      description:
        "Повний внутрішній конспект по портативних зарядних станціях: сценарії, формула розрахунку, порти, сонячні панелі, помилки, заперечення та базова логіка підбору.",
      contentBlocks: portablePowerStationsFoundationBlocks,
      durationMin: 34,
      sortOrder: 1,
      questions: portablePowerStationsFoundationQuestions()
    },
    {
      title: "Портативні зарядні станції: EcoFlow, Bluetti, Anker SOLIX, Jackery",
      description:
        "Розширене порівняння популярних лінійок зарядних станцій: таблиці по EcoFlow, Bluetti, Anker SOLIX і Jackery та правила читання характеристик.",
      contentBlocks: portablePowerStationsCatalogBlocks,
      durationMin: 39,
      sortOrder: 2,
      questions: portablePowerStationsCatalogQuestions()
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

  console.log("Portable power stations content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
