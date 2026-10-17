import { PrismaClient, QuestionType } from "@prisma/client";
import camerasDigitalCamerasContent from "../lib/content/cameras-digital-cameras";
import type { ModuleContentBlock } from "../lib/module-content";

const prisma = new PrismaClient();
const { digitalCamerasCatalogBlocks, digitalCamerasFoundationBlocks } = camerasDigitalCamerasContent;

function digitalCamerasFoundationQuestions() {
  return [
    {
      question: "Коли Instax зазвичай є кращою рекомендацією, ніж Canon DSLR?",
      type: QuestionType.SINGLE,
      options: [
        "Коли клієнту потрібні комерційні зйомки з повним ручним контролем",
        "Коли потрібні емоції тут і зараз, подарунок, подія або подорож",
        "Коли головна вимога - швидкий автофокус на спорті",
        "Коли потрібна змінна оптика і full frame"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які формати Instax згадуються у матеріалі?",
      type: QuestionType.MULTIPLE,
      options: ["Mini", "Square", "Wide", "Panorama"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "Що найкраще описує різницю між Instax і Canon 5D?",
      type: QuestionType.SINGLE,
      options: [
        "Instax - це цифровий full frame, Canon - моментальний друк",
        "Instax - простий моментальний друк, Canon - професійніший контроль і змінна оптика",
        "Обидва продукти розраховані лише на дитячу аудиторію",
        "Canon 5D друкує фото відразу після натискання"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "True/False: Картриджі Instax є витратним матеріалом, тому їх логічно пропонувати разом із камерою.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Що важливо уточнити перед продажем Canon DSLR?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки колір корпусу",
        "Чи потрібні оптика, карта пам'яті, додатковий акумулятор і сценарій зйомки",
        "Лише наявність Bluetooth-динаміка",
        "Чи хоче клієнт друкувати фото миттєво"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function digitalCamerasCatalogQuestions() {
  return [
    {
      question: "Яка Instax-модель у вашому каталозі використовує найбільший формат плівки?",
      type: QuestionType.SINGLE,
      options: ["Instax Mini 12", "Instax SQ1", "Instax Wide 300", "Instax Mini 40"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель поєднує цифрову камеру, прев'ю на екрані та друк зі смартфона з 100 творчими комбінаціями ефектів?",
      type: QuestionType.SINGLE,
      options: ["Instax Mini Evo", "Instax Mini 90", "Canon EOS 5D Mark II", "Instax SQ1"],
      correctAnswer: { index: 0 },
      sortOrder: 2
    },
    {
      question: "Яка Canon-модель у вашому матеріалі має 61 точку автофокусу та два слоти карт пам'яті?",
      type: QuestionType.SINGLE,
      options: ["Canon EOS 5D Mark II", "Canon EOS 5D Mark III", "Instax Mini LiPlay", "Instax Wide 300"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "Оберіть моделі з акумуляторним сценарієм живлення, а не з одноразовими AA/CR2.",
      type: QuestionType.MULTIPLE,
      options: ["Instax Mini 90", "Instax Mini Evo", "Instax Mini LiPlay", "Instax Mini 12", "Instax SQ1"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 4
    },
    {
      question: "Яка модель найкраще підходить як доступніший вхід у повний кадр Canon?",
      type: QuestionType.SINGLE,
      options: ["Canon EOS 5D Mark II", "Canon EOS 5D Mark III", "Instax Mini 40", "Instax Wide 300"],
      correctAnswer: { index: 0 },
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
  questions: ReturnType<typeof digitalCamerasFoundationQuestions>;
};

async function main() {
  const category = await prisma.category.findFirst({
    where: {
      slug: "digital-cameras",
      brand: { slug: "cameras" }
    },
    include: {
      modules: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true, title: true }
      }
    }
  });

  if (!category) {
    throw new Error("Категорію Камери / digital-cameras не знайдено.");
  }

  const blueprints: ModuleBlueprint[] = [
    {
      title: "Портативні камери: Instax, DSLR та логіка консультації",
      description:
        "Практичний модуль для консультації по миттєвих камерах Fujifilm Instax і DSLR Canon: сценарії, формати, апсейл і коротка логіка підбору.",
      contentBlocks: digitalCamerasFoundationBlocks,
      durationMin: 27,
      sortOrder: 1,
      questions: digitalCamerasFoundationQuestions()
    },
    {
      title: "Портативні камери: Fujifilm Instax і Canon EOS 5D",
      description:
        "Каталог моделей Instax і Canon 5D з позиціонуванням, форматами плівки, відмінностями між моделями та рекомендаціями під запит клієнта.",
      contentBlocks: digitalCamerasCatalogBlocks,
      durationMin: 38,
      sortOrder: 2,
      questions: digitalCamerasCatalogQuestions()
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

  console.log("Cameras digital cameras content synced successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
