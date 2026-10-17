import { PrismaClient, QuestionType } from "@prisma/client";
import dysonAirPurifiersContent from "../lib/content/dyson-air-purifiers";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { dysonAirPurifiersCatalogBlocks, dysonAirPurifiersFoundationBlocks } = dysonAirPurifiersContent;

function dysonAirPurifiersFoundationQuestions() {
  return [
    {
      question: "Який запит клієнта найкраще веде до моделі Dyson PH04?",
      type: QuestionType.SINGLE,
      options: [
        "Потрібен тільки локальний обігрівач",
        "Потрібно очищення повітря плюс зволоження в одному пристрої",
        "Потрібен пилосос для килима",
        "Потрібен лише вентилятор без додаткових функцій"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які технологічні акценти важливі в категорії Dyson Air Care?",
      type: QuestionType.MULTIPLE,
      options: [
        "Air Multiplier",
        "HEPA-фільтрація",
        "Активоване вугілля",
        "UV-стерилізація у відповідних моделях",
        "Фізична клавіатура"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson AM09 продається насамперед як очищувач повітря з HEPA-фільтром.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще підходить, якщо клієнту потрібне потужне очищення великого приміщення і тиха робота?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson AM09 Hot and Cool",
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson Corrale"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що варто з'ясувати на старті консультації в Dyson Air Care?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір коробки подобається клієнту",
        "Яку проблему клієнт хоче вирішити: пил, сухість повітря, спеку, холод чи універсальний сценарій",
        "Чи любить клієнт дротові навушники",
        "Який у клієнта улюблений бренд телефону"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonAirPurifiersCatalogQuestions() {
  return [
    {
      question: "Яка модель у каталозі Dyson поєднує очищення, зволоження та охолодження?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson AM09 Hot and Cool",
        "Dyson Supersonic Nural"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі, що входять до каталогу Dyson Air Care у вашому матеріалі.",
      type: QuestionType.MULTIPLE,
      options: [
        "Dyson Purifier Big+Quiet Formaldehyde BP03",
        "Dyson Purifier Humidify+Cool Formaldehyde PH04",
        "Dyson Purifier Hot+Cool Formaldehyde HP09",
        "Dyson AM09 Hot and Cool",
        "Dyson Airwrap i.d."
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: HP09 позиціонується як цілорічне рішення з очищенням, обігрівом та охолодженням.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель у каталозі найкраще відповідає сценарію преміального Hot+Cool без акценту на HEPA-очищення як головну цінність?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson AM09 Hot and Cool",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Hot+Cool HP09"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що є найсильнішим позиціонуванням BP03 у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: [
        "Пристрій для укладки волосся",
        "Очищення повітря для великих приміщень із тихою роботою",
        "Компактний трекер для пошуку ключів",
        "Бездротовий випрямляч"
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
  questions: ReturnType<typeof dysonAirPurifiersFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "air-purifiers",
      brand: { slug: "dyson" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Dyson / air-purifiers не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Dyson Очищувачі повітря: зволоження, формальдегід і підбір під сценарій",
      description: "Внутрішній конспект по Dyson Air Care: очищення повітря, зволоження, формальдегід, обігрів, охолодження і логіка підбору моделі під потребу клієнта.",
      contentBlocks: dysonAirPurifiersFoundationBlocks,
      durationMin: 26,
      sortOrder: 1,
      questions: dysonAirPurifiersFoundationQuestions()
    },
    {
      title: "Dyson Очищувачі повітря: моделі BP03, PH04, HP09 та AM09",
      description: "Каталог Dyson Air Care з ключовими моделями очищення, зволоження та Hot+Cool сценаріїв для швидкої консультації й порівняння.",
      contentBlocks: dysonAirPurifiersCatalogBlocks,
      durationMin: 29,
      sortOrder: 2,
      questions: dysonAirPurifiersCatalogQuestions()
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

  console.log("Dyson air purifiers content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
