import { PrismaClient, QuestionType } from "@prisma/client";
import marshallBluetoothSpeakersContent from "../lib/content/marshall-bluetooth-speakers";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { marshallSpeakersCatalogBlocks, marshallSpeakersFoundationBlocks } = marshallBluetoothSpeakersContent;

function marshallSpeakersFoundationQuestions() {
  return [
    {
      question: "Яка серія Marshall найкраще підходить для великої кімнати або домашніх вечірок, коли клієнту потрібна максимальна потужність?",
      type: QuestionType.SINGLE,
      options: ["Woburn", "Acton", "Willen", "Emberton"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть портативні моделі Marshall із вашого матеріалу.",
      type: QuestionType.MULTIPLE,
      options: ["Tufton", "Kilburn II", "Middleton", "Stockwell II", "Woburn II"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Acton у вашому матеріалі позиціонується як компактна домашня колонка, а не як портативний варіант з акумулятором.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що найкраще запитати в клієнта на старті консультації по Marshall?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір логотипа подобається більше",
        "Для дому чи для вулиці потрібна колонка, і який розмір простору або сценарій використання",
        "Чи потрібен лише найдорожчий варіант",
        "Який смартфон у клієнта, без уточнення інших потреб"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка модель Marshall у вашому матеріалі описана як найуніверсальніша домашня колонка для вітальні?",
      type: QuestionType.SINGLE,
      options: ["Stanmore", "Willen", "Emberton II", "Stockwell II"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function marshallSpeakersCatalogQuestions() {
  return [
    {
      question: "Яка модель Marshall у вашому каталозі має HDMI серед основних підключень?",
      type: QuestionType.SINGLE,
      options: ["Woburn III", "Stanmore II", "Acton II", "Kilburn II"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Marshall, для яких у матеріалі прямо зазначений захист IP67.",
      type: QuestionType.MULTIPLE,
      options: ["Middleton", "Willen", "Tufton", "Stockwell II", "Woburn II"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 2
    },
    {
      question: "True/False: Tufton у вашому матеріалі продається як найбільший і найпотужніший portable Marshall із 20+ год автономності.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Marshall є найменшою та найлегшою у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: ["Willen", "Emberton", "Stockwell II", "Middleton"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що найкраще описує позиціонування Middleton у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Базова домашня колонка для маленької кімнати",
        "Сучасний premium portable Marshall із True Stereophonic та IP67",
        "Стара стаціонарна модель лише з RCA",
        "Ультрапортативна модель вагою 0,31 кг"
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
  questions: ReturnType<typeof marshallSpeakersFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "bluetooth-speakers",
      brand: { slug: "marshall" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Marshall / bluetooth-speakers не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Marshall Bluetooth-колонки: лінійка, формати та логіка підбору",
      description:
        "Внутрішній конспект по Marshall: бренд, домашні й портативні формати, ключові відмінності між серіями та швидка логіка рекомендації під сценарій клієнта.",
      contentBlocks: marshallSpeakersFoundationBlocks,
      durationMin: 23,
      sortOrder: 1,
      questions: marshallSpeakersFoundationQuestions()
    },
    {
      title: "Marshall Bluetooth-колонки: Woburn, Stanmore, Acton, Tufton, Middleton та інші моделі",
      description:
        "Каталог Marshall-колонок з ключовими характеристиками, позиціонуванням і швидким підбором під дім, подорожі, вечірки та щоденне використання.",
      contentBlocks: marshallSpeakersCatalogBlocks,
      durationMin: 34,
      sortOrder: 2,
      questions: marshallSpeakersCatalogQuestions()
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

  console.log("Marshall bluetooth speakers content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
