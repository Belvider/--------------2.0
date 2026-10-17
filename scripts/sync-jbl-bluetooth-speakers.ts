import { PrismaClient, QuestionType } from "@prisma/client";
import jblBluetoothSpeakersContent from "../lib/content/jbl-bluetooth-speakers";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { jblCatalogBlocks, jblFoundationBlocks } = jblBluetoothSpeakersContent;

function jblFoundationQuestions() {
  return [
    {
      question: "Що найкраще уточнити на старті консультації по JBL, перш ніж переходити до конкретної моделі?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір колонки",
        "Сценарій: компактний portable, універсальна колонка, party-формат, домашнє аудіо чи саундбар під ТВ",
        "Тільки максимальну гучність без інших уточнень",
        "Чи потрібна модель з найдорожчої лінійки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка лінійка JBL у вашому матеріалі позиціонується як преміальне домашнє аудіо з ретро-дизайном?",
      type: QuestionType.SINGLE,
      options: ["PartyBox", "Pulse", "Authentics", "Go"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть компактні JBL-напрямки з модуля, які відповідають за максимум мобільності.",
      type: QuestionType.MULTIPLE,
      options: ["Go", "Clip", "Wind", "Bar", "Authentics"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: PartyBoost у JBL важливо продавати як аргумент для об'єднання сумісних колонок у гучнішу систему або стереопару.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка JBL-лінійка у вашому матеріалі відповідає за сценарій телевізора, фільмів та домашнього кінотеатру?",
      type: QuestionType.SINGLE,
      options: ["Charge", "Pulse", "JBL Bar", "Xtreme"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function jblCatalogQuestions() {
  return [
    {
      question: "Яка модель JBL у вашому каталозі має потужність 1170 Вт, 10-дюймовий сабвуфер і знімні бездротові колонки?",
      type: QuestionType.SINGLE,
      options: ["JBL Bar 500", "JBL PartyBox 710", "JBL Bar 1300", "JBL Boombox 3"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Оберіть JBL-моделі, де у вашому матеріалі прямо присутній powerbank-сценарій або USB для заряджання інших пристроїв.",
      type: QuestionType.MULTIPLE,
      options: ["Charge 5", "Xtreme 3", "Boombox 2", "Pulse 5", "Go 4"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: JBL Pulse 5 у вашому каталозі поєднує світлове шоу 360° і захист IP67.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель JBL найкраще відповідає сценарію велосипеда, самоката або мотоцикла?",
      type: QuestionType.SINGLE,
      options: ["JBL Clip 4", "JBL Wind 3S", "JBL Go 3", "JBL PartyBox Club 120"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яке сімейство JBL у вашому матеріалі треба продавати через мікрофонні входи, гітару, підсвітку та вечірковий сценарій?",
      type: QuestionType.SINGLE,
      options: ["Authentics", "JBL Bar", "PartyBox", "Flip"],
      correctAnswer: { index: 2 },
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
  questions: ReturnType<typeof jblFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "bluetooth-speakers",
      brand: { slug: "jbl" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію JBL / bluetooth-speakers не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "JBL аудіо: лінійки, сценарії та логіка консультації",
      description:
        "Внутрішній конспект по JBL: portable-моделі, PartyBox, Authentics, JBL Bar і швидкий маршрут підбору під сценарій клієнта.",
      contentBlocks: jblFoundationBlocks,
      durationMin: 27,
      sortOrder: 1,
      questions: jblFoundationQuestions()
    },
    {
      title: "JBL: Go, Clip, Flip, Charge, Pulse, Xtreme, PartyBox, Authentics і Bar",
      description:
        "Каталог JBL-моделей із ключовими характеристиками, позиціонуванням та швидким підбором під мобільний, домашній і кінотеатральний сценарій.",
      contentBlocks: jblCatalogBlocks,
      durationMin: 39,
      sortOrder: 2,
      questions: jblCatalogQuestions()
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

  console.log("JBL bluetooth speakers content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
