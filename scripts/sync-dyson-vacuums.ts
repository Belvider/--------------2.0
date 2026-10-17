import { PrismaClient, QuestionType } from "@prisma/client";
import dysonVacuumsContent from "../lib/content/dyson-vacuums";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { dysonVacuumsCatalogBlocks, dysonVacuumsFoundationBlocks } = dysonVacuumsContent;

function dysonVacuumsFoundationQuestions() {
  return [
    {
      question: "Що найкраще продає Dyson у категорії cordless-пилососів?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки яскравий колір корпусу",
        "Поєднання потужності всмоктування, ергономіки, насадок і бездротового сценарію",
        "Лише найнижча ціна в категорії",
        "Виключно маленький контейнер"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які комплектації або позиціонування важливо пояснювати клієнту в Dyson-пилососах?",
      type: QuestionType.MULTIPLE,
      options: [
        "Standard",
        "Absolute",
        "Animal",
        "Pro",
        "Satellite"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: WashG1 варто продавати насамперед як рішення для твердих підлог, а не як головний варіант для килимів.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію прибирання шерсті тварин уже на рівні назви комплектації?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson V11 Animal",
        "Dyson V8 Standard",
        "Dyson WashG1",
        "Dyson 360 Heurist"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що потрібно з'ясувати перед рекомендацією моделі Dyson-пилососа?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір клієнта",
        "Тип покриттів, наявність тварин, потребу у вологому прибиранні, площу та бажаний формат",
        "Тільки бренд смартфона клієнта",
        "Тільки розмір коробки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonVacuumsCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі Dyson додає сценарій вологого прибирання завдяки насадці Submarine?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson V15 Detect",
        "Dyson V15s Detect Submarine",
        "Dyson V11",
        "Dyson Gen5detect"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі, що входять до лінійки Dyson Gen5detect у вашому каталозі.",
      type: QuestionType.MULTIPLE,
      options: [
        "Gen5detect Absolute Pro",
        "Gen5detect Absolute",
        "Gen5detect",
        "V15 Detect Absolute",
        "WashG1"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson Gen5detect Absolute Pro у вашому матеріалі має гнучку щілинну насадку та адаптер для зарядки в автомобілі.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію роботизованого прибирання з камерою 360° та картографією?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson WashG1",
        "Dyson V10 Absolute",
        "Dyson 360 Heurist",
        "Dyson V8 Absolute"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що є найсильнішим позиціонуванням Dyson V15 Detect Absolute у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: [
        "Базовий бюджетний Dyson без лазера",
        "Один із найсильніших Dyson із лазерним підсвічуванням і ширшою комплектацією",
        "Лише миючий пристрій для плитки",
        "Робот-пилосос для автономного прибирання"
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
  questions: ReturnType<typeof dysonVacuumsFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "vacuums",
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
    throw new Error("Категорію Dyson / vacuums не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Dyson Пилососи: лінійки, комплектації та підбір під сценарій прибирання",
      description: "Внутрішній конспект по пилососах Dyson: cordless-моделі, комплектації Standard / Absolute / Animal / Pro, вологе прибирання і роботи-пилососи.",
      contentBlocks: dysonVacuumsFoundationBlocks,
      durationMin: 34,
      sortOrder: 1,
      questions: dysonVacuumsFoundationQuestions()
    },
    {
      title: "Dyson Пилососи: моделі Gen5, V15, V11, V10, V8, WashG1 та 360",
      description: "Каталог Dyson Vacuum з ключовими лінійками, комплектаціями і сценаріями використання для швидкого порівняння в консультації.",
      contentBlocks: dysonVacuumsCatalogBlocks,
      durationMin: 41,
      sortOrder: 2,
      questions: dysonVacuumsCatalogQuestions()
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

  console.log("Dyson vacuums content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
