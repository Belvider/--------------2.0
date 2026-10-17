import type { ModuleCatalogProduct, ModuleContentBlock } from "@/lib/module-content";
import accessoryApplePeripheralsContent from "@/lib/content/accessory-apple-peripherals";
import accessoryCasesContent from "@/lib/content/accessory-cases";
import accessoryBelkinContent from "@/lib/content/accessory-belkin";
import accessoryGlassContent from "@/lib/content/accessory-glass";
import accessoryPowerContent from "@/lib/content/accessory-power";
import accessorySatechiContent from "@/lib/content/accessory-satechi";

export const accessoryPageSlugs = ["cases", "glass", "power", "belkin", "satechi", "apple-peripherals"] as const;

export type AccessoryPageSlug = (typeof accessoryPageSlugs)[number];

export type AccessoryPageSection = {
  id: string;
  title: string;
  html: string;
};

export type AccessoryPageContent = {
  slug: AccessoryPageSlug;
  label: string;
  title: string;
  subtitle: string;
  sideLabel: string;
  sideText: string;
  sections: AccessoryPageSection[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderDocImage(url: string, alt: string, caption?: string) {
  return `
    <figure class="doc-image">
      <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" />
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

function renderFactsHtml(items: string[]) {
  return `
    <ul>
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderCatalogHtml(products: ModuleCatalogProduct[]) {
  return products
    .map((product) => {
      const defaultColor = product.colors.find((color) => color.default) ?? product.colors[0];
      const imageHtml = defaultColor
        ? renderDocImage(defaultColor.imageUrl, defaultColor.caption || product.title, defaultColor.caption)
        : "";

      return `
        <article class="accessory-catalog-entry">
          ${imageHtml}
          <h4>${escapeHtml(product.title)}</h4>
          ${product.summary ? `<p>${escapeHtml(product.summary)}</p>` : ""}
          ${product.overview.length ? `<p><strong>Коротко:</strong> ${product.overview.map(escapeHtml).join(" • ")}</p>` : ""}
          ${product.highlights.length ? renderFactsHtml(product.highlights) : ""}
        </article>
      `;
    })
    .join("");
}

function createSectionsFromModuleBlocks(blocks: ModuleContentBlock[], prefix: string): AccessoryPageSection[] {
  return blocks.flatMap((block, index) => {
    let html = "";

    switch (block.type) {
      case "text":
        html = block.html;
        break;
      case "image":
        html = renderDocImage(block.url, block.caption || block.title, block.caption);
        break;
      case "facts":
        html = renderFactsHtml(block.items);
        break;
      case "productCatalog":
        html = renderCatalogHtml(block.products);
        break;
      default:
        return [];
    }

    return [
      {
        id: `${prefix}-section-${index + 1}`,
        title: block.title,
        html
      }
    ];
  });
}

function createCasesSections(): AccessoryPageSection[] {
  return accessoryCasesContent.accessoryCasesBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `cases-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createGlassSections(): AccessoryPageSection[] {
  return accessoryGlassContent.accessoryGlassBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `glass-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createBelkinSections(): AccessoryPageSection[] {
  return accessoryBelkinContent.accessoryBelkinBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `belkin-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createPowerSections(): AccessoryPageSection[] {
  return accessoryPowerContent.accessoryPowerBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `power-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createSatechiSections(): AccessoryPageSection[] {
  return accessorySatechiContent.accessorySatechiBlocks
    .filter((block): block is { type: "text"; title: string; html: string } => block.type === "text")
    .map((block, index) => ({
      id: `satechi-section-${index + 1}`,
      title: block.title,
      html: block.html
    }));
}

function createApplePeripheralsSections(): AccessoryPageSection[] {
  return createSectionsFromModuleBlocks(
    accessoryApplePeripheralsContent.accessoryApplePeripheralsBlocks,
    "apple-peripherals"
  );
}

const ACCESSORY_PAGES: Record<AccessoryPageSlug, AccessoryPageContent> = {
  cases: {
    slug: "cases",
    label: "Аксесуарний блок",
    title: "Чохли та MagSafe-кейси",
    subtitle:
      "Повний блок по чохлах без скорочення матеріалу: офіційні Apple Case з MagSafe, додаткові аксесуари Apple для iPhone та iPad, а також логіка продажу Pitaka, Spigen і UAG.",
    sideLabel: "Що всередині",
    sideText:
      "Матеріали, конструкції, сценарії рекомендації, MagSafe-сумісність, догляд, порівняння брендів і чек-листи перед видачею клієнту.",
    sections: createCasesSections()
  },
  glass: {
    slug: "glass",
    label: "Аксесуарний блок",
    title: "Захисне скло",
    subtitle:
      "Повний блок по захисному склу без стискання змісту: що таке tempered glass, які типи ми пропонуємо, як пояснювати різницю клієнту і які лінійки скла є в PineApple.",
    sideLabel: "Що всередині",
    sideText:
      "Технічна база, типи покриттів, аргументація для продавця, лінійки PineApple Titanium, Monblan, Ilera, NeuChatel, а також установка, сумісність і чек-лист перед видачею.",
    sections: createGlassSections()
  },
  belkin: {
    slug: "belkin",
    label: "Аксесуарний блок",
    title: "Belkin",
    subtitle:
      "Повний блок по Belkin без скорочення змісту: зарядки BoostCharge, кабелі, хаби Connect, аудіолінійка SoundForm і важливий recall, який потрібно знати в продажах.",
    sideLabel: "Що всередині",
    sideText:
      "Позиціонування бренду, recall по BPD005, зарядні станції MagSafe/Qi2, GaN-адаптери, кабелі 240W, TB4-доки, мультипортові хаби та повсякденне аудіо Belkin.",
    sections: createBelkinSections()
  },
  power: {
    slug: "power",
    label: "Аксесуарний блок",
    title: "Живлення та кабелі",
    subtitle:
      "Повний блок по адаптерах живлення Apple і кабелях без скорочення змісту: потужності, fast charge, сценарії для MacBook, iPhone та iPad, а також логіка швидкого підбору під клієнта.",
    sideLabel: "Що всередині",
    sideText:
      "Рекомендовані адаптери для MacBook, fast charge для 14″ і 16″ Pro, інші адаптери Apple, кабелі USB-C / MagSafe / Thunderbolt і таблиці швидкого добору.",
    sections: createPowerSections()
  },
  satechi: {
    slug: "satechi",
    label: "Аксесуарний блок",
    title: "Satechi",
    subtitle:
      "Повний блок по Satechi без скорочення змісту: USB4 і Thunderbolt-хаби, Stand & Hub рішення, GaN-зарядки, Qi2 travel-аксесуари, клавіатури та периферія в Apple-style естетиці.",
    sideLabel: "Що всередині",
    sideText:
      "USB4 Multiport Adapter, Pro Hub серія для MacBook, TB4 Multi Display Dock, Stand & Hub для Mac mini, 165W GaN Charger, Qi2 travel-рішення та периферія для desk-setup.",
    sections: createSatechiSections()
  },
  "apple-peripherals": {
    slug: "apple-peripherals",
    label: "Аксесуарний блок",
    title: "Apple периферія",
    subtitle:
      "Повний блок по Apple-периферії без скорочення змісту: Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad як доповнення до екосистеми Apple.",
    sideLabel: "Що всередині",
    sideText:
      "Сценарії продажу периферії Apple, ключові функції по категоріях і повний каталог моделей з технічними характеристиками та сумісністю.",
    sections: createApplePeripheralsSections()
  }
};

export function isAccessoryPageSlug(value: string): value is AccessoryPageSlug {
  return accessoryPageSlugs.includes(value as AccessoryPageSlug);
}

export function getAccessoryPageContent(slug: AccessoryPageSlug) {
  return ACCESSORY_PAGES[slug];
}
