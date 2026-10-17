import { PrismaClient, QuestionType } from "@prisma/client";
import dysonHairStylersContent from "../lib/content/dyson-hair-stylers";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { dysonHairStylersCatalogBlocks, dysonHairStylersFoundationBlocks } = dysonHairStylersContent;

function dysonHairStylersFoundationQuestions() {
  return [
    {
      question: "Що в Dyson hair-категорії найкраще продає бренд ще до конкретної моделі?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки велика кількість кольорів",
        "Поєднання мотора, контролю температури, ергономіки та дбайливого ставлення до волосся",
        "Лише мінімальна ціна",
        "Виключно популярність у соцмережах"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які фактори критично уточнювати при консультації по Dyson, особливо якщо пристрій привезений з іншого ринку?",
      type: QuestionType.MULTIPLE,
      options: [
        "Тип вилки",
        "Напруга мережі",
        "Сервісна придатність у регіоні купівлі",
        "Колір коробки",
        "Комплектація під конкретний ринок"
      ],
      correctAnswer: { indices: [0, 1, 2, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Complete Long відрізняється від базового Airwrap насамперед довшими циліндричними насадками.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка версія Airwrap найкраще підходить клієнту з кучерявим або кудрявим волоссям?",
      type: QuestionType.SINGLE,
      options: [
        "Volumise",
        "Straight to Wavy",
        "Curly to Coily",
        "Corrale"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що найкраще рекомендувати клієнту, якому важливі одночасне сушіння й вирівнювання без гарячих пластин?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Corrale",
        "Dyson Airstrait",
        "Dyson Supersonic HD11",
        "Dyson Airwrap Volumise"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonHairStylersCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі Dyson додає Bluetooth і роботу з додатком MyDyson?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Airwrap Multi-styler / Complete Long",
        "Dyson Airwrap i.d.",
        "Dyson Supersonic HD07",
        "Dyson Corrale"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі з лінійки Dyson Supersonic у цьому каталозі.",
      type: QuestionType.MULTIPLE,
      options: [
        "HD07",
        "HD11",
        "HD18",
        "Nural",
        "Coanda 2x"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson Corrale може працювати без кабелю приблизно до 30 хвилин.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель позиціонується як найінтелектуальніший фен Dyson із захистом шкіри голови?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Supersonic HD07",
        "Dyson Supersonic Nural",
        "Dyson Supersonic HD11",
        "Dyson Supersonic Pro HD18"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка новація найбільше відрізняє Dyson Airwrap Coanda 2x від попередніх версій у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Перехід на провід Lightning",
        "Повна відмова від насадок",
        "Двигун Hyperdymium 2 та 2x сильніший повітряний потік",
        "Робота тільки з мокрим волоссям"
      ],
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
  questions: ReturnType<typeof dysonHairStylersFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "hair-stylers",
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
    throw new Error("Категорію Dyson / hair-stylers не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Dyson Фени та стайлери: Airwrap, ринки та підбір під тип волосся",
      description: "Внутрішній конспект по Dyson Hair: ринки, насадки, Airwrap, Supersonic, Corrale, Airstrait і логіка підбору під потреби клієнта.",
      contentBlocks: dysonHairStylersFoundationBlocks,
      durationMin: 32,
      sortOrder: 1,
      questions: dysonHairStylersFoundationQuestions()
    },
    {
      title: "Dyson Фени та стайлери: моделі Airwrap, Supersonic, Corrale та Airstrait",
      description: "Каталог лінійок Dyson Hair з моделями, кольорами, ключовими характеристиками та швидкою логікою рекомендації під запит клієнта.",
      contentBlocks: dysonHairStylersCatalogBlocks,
      durationMin: 44,
      sortOrder: 2,
      questions: dysonHairStylersCatalogQuestions()
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

  console.log("Dyson hair stylers content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
