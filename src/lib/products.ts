export type Metal = "gold" | "silver";

export const metalOptions: Record<
  Metal,
  { label: string; mood: string; detail: string; swatch: string; orb: string; glow: string }
> = {
  gold: {
    label: "Златно",
    mood: "топъл блясък",
    detail: "Сребро 925 с 18К златно покритие",
    swatch: "linear-gradient(135deg, #f3dfa6 0%, #c9a24e 55%, #a9832f 100%)",
    orb: "radial-gradient(circle at 32% 28%, #fff7dc 0%, #f1d58e 22%, #cfa24a 55%, #8f6a22 100%)",
    glow: "linear-gradient(115deg, #f7e7bd 0%, #e6c77e 45%, #d4ad5c 100%)",
  },
  silver: {
    label: "Сребърно",
    mood: "хладен блясък",
    detail: "Сребро 925",
    swatch: "linear-gradient(135deg, #f4f4f2 0%, #c8c8c6 55%, #9d9d9b 100%)",
    orb: "radial-gradient(circle at 32% 28%, #ffffff 0%, #eceef0 22%, #b9bcc0 55%, #7d8085 100%)",
    glow: "linear-gradient(115deg, #f6f7f8 0%, #dcdee1 45%, #c4c7cb 100%)",
  },
};

export const metalOrder: Metal[] = ["gold", "silver"];

/** Gold-plated pieces cost a little more than plain sterling silver. */
export const GOLD_SURCHARGE = 8;

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  sizeLabel: string;
  sizes: string[];
  defaultSize: string;
  sizeHint: string;
};

export const categoryList: Category[] = [
  {
    slug: "bracelets",
    name: "Гривни за ръка",
    shortName: "Гривни",
    description: "Мъниста, тънки верижки и висулки, нанизани и затворени на ръка в студиото.",
    image: "/jewelry/bracelet-silver-arms.jpg",
    sizeLabel: "Обиколка на китката",
    sizes: ["15 см", "16 см", "17 см", "18 см", "19 см"],
    defaultSize: "17 см",
    sizeHint: "Измери китката с лента и добави 1 см за свободно носене.",
  },
  {
    slug: "anklets",
    name: "Гривни за крак",
    shortName: "За крак",
    description: "Леки летни верижки и звънчета за боси крака и сандали.",
    image: "/jewelry/anklet-gold-slipper.jpg",
    sizeLabel: "Обиколка на глезена",
    sizes: ["22 см", "24 см", "26 см"],
    defaultSize: "24 см",
    sizeHint: "Измери над глезенната кост и добави 1–2 см.",
  },
  {
    slug: "necklaces",
    name: "Гердани",
    shortName: "Гердани",
    description: "Висулки, перлени нишки и фини верижки за всеки ден и за повод.",
    image: "/jewelry/necklace-gold-drop.jpg",
    sizeLabel: "Дължина",
    sizes: ["40 см", "45 см", "50 см"],
    defaultSize: "45 см",
    sizeHint: "40 см стои до ключицата, 45 см е класика, 50 см пада под нея.",
  },
  {
    slug: "earrings",
    name: "Обеци",
    shortName: "Обеци",
    description: "Висящи обеци, халки и възли, оформени и полирани на ръка.",
    image: "/jewelry/earrings-silver-branch.jpg",
    sizeLabel: "Размер",
    sizes: ["Малки", "Средни"],
    defaultSize: "Малки",
    sizeHint: "Малките са около 1,5 см, средните около 3 см.",
  },
  {
    slug: "rings",
    name: "Пръстени",
    shortName: "Пръстени",
    description: "Тънки халки и пръстени с текстура, които се носят сами или на купчинка.",
    image: "/jewelry/ring-gold-studded.jpg",
    sizeLabel: "Размер на пръстена",
    sizes: ["50", "52", "54", "56", "58"],
    defaultSize: "54",
    sizeHint: "Размерът е вътрешната обиколка в мм. Ако си между два, вземи по-големия.",
  },
  {
    slug: "keychains",
    name: "Ключодържатели",
    shortName: "Ключодържатели",
    description: "Макраме, мъниста и метални халки: малък ръчен подарък за всеки ден.",
    image: "/jewelry/keychain-macrame-wristlet.jpg",
    sizeLabel: "Размер",
    sizes: ["Мини", "Класик"],
    defaultSize: "Класик",
    sizeHint: "Мини е около 8 см, Класик около 14 см с халката.",
  },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  /** Price in the base metal (silver). Gold adds GOLD_SURCHARGE. */
  price: number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  alt: string;
  description: string;
  details: string[];
  materials: string[];
  features: string[];
  badge?: string;
  defaultMetal: Metal;
  featured?: boolean;
  inStock?: boolean;
};

const C = {
  bracelets: "Гривни за ръка",
  anklets: "Гривни за крак",
  necklaces: "Гердани",
  earrings: "Обеци",
  rings: "Пръстени",
  keychains: "Ключодържатели",
} as const;

export const products: Product[] = [
  {
    slug: "rozova-mygla-grivna",
    name: "Гривна Розова мъгла",
    category: C.bracelets,
    price: 34,
    image: "/jewelry/bracelet-beaded-rose.jpg",
    hoverImage: "/jewelry/bracelet-beaded-pastel.jpg",
    gallery: ["/jewelry/bracelet-beaded-rose.jpg", "/jewelry/bracelet-beaded-pastel.jpg", "/jewelry/bracelet-hands-flowers.jpg"],
    alt: "Гривна от розови и сиви мъниста върху светла маса",
    description: "Меки розови и опушени мъниста, нанизани на здрав ластичен шнур с малка метална вложка.",
    details: ["Мъниста от естествен камък, 6 мм", "Метална вложка по избор", "Нанизана на ръка, всяка е леко различна"],
    materials: ["Мъниста", "Естествен камък"],
    features: ["Ръчно изработено", "Готово за подарък"],
    badge: "Бестселър",
    defaultMetal: "silver",
    featured: true,
    inStock: true,
  },
  {
    slug: "tanka-nishka-grivna",
    name: "Верижка Тънка нишка",
    category: C.bracelets,
    price: 46,
    image: "/jewelry/bracelet-gold-chain.jpg",
    hoverImage: "/jewelry/bracelet-wrist-hand.jpg",
    gallery: ["/jewelry/bracelet-gold-chain.jpg", "/jewelry/bracelet-wrist-hand.jpg", "/jewelry/ring-gold-pile.jpg"],
    alt: "Тънка златна верижка гривна върху бял лен",
    description: "Фина верижка, която се носи сама или на купчинка с мъниста. Удължител от 2 см за точно прилягане.",
    details: ["Верижка 1,2 мм", "Карабинер и удължител 2 см", "Подходяща за всекидневно носене"],
    materials: ["Верижка"],
    features: ["Ръчно изработено", "Хипоалергенно"],
    badge: "Ново",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "morsko-staklo-grivna",
    name: "Гривна Морско стъкло",
    category: C.bracelets,
    price: 42,
    image: "/jewelry/bracelet-turquoise-charms.jpg",
    hoverImage: "/jewelry/bracelet-silver-wrist.jpg",
    gallery: ["/jewelry/bracelet-turquoise-charms.jpg", "/jewelry/bracelet-silver-wrist.jpg", "/jewelry/bracelet-silver-arms.jpg"],
    alt: "Сребърна гривна с тюркоазени мъниста и висулки",
    description: "Верижка с малки тюркоазени капки, която напомня за лято край морето.",
    details: ["Тюркоазени стъклени мъниста", "Ръчно закачени висулки", "Удължител 2 см"],
    materials: ["Верижка", "Стъкло"],
    features: ["Ръчно изработено", "Ограничена серия"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "sarchitse-grivna",
    name: "Гривна Сърчице",
    category: C.bracelets,
    price: 38,
    image: "/jewelry/bracelet-heart.jpg",
    hoverImage: "/jewelry/bracelet-silver-arms.jpg",
    gallery: ["/jewelry/bracelet-heart.jpg", "/jewelry/bracelet-silver-arms.jpg"],
    alt: "Фина верижка гривна с висулка сърце на бял фон",
    description: "Тънка верижка с малко сърце, което може да се гравира с инициал.",
    details: ["Висулка сърце 8 мм", "Гравиране на инициал по желание", "Удължител 2 см"],
    materials: ["Верижка"],
    features: ["Ръчно изработено", "Възможно гравиране", "Готово за подарък"],
    badge: "Подарък",
    defaultMetal: "silver",
    featured: true,
    inStock: true,
  },
  {
    slug: "gorski-mah-grivna",
    name: "Гривна Горски мъх",
    category: C.bracelets,
    price: 32,
    image: "/jewelry/bracelet-beaded-green.jpg",
    gallery: ["/jewelry/bracelet-beaded-green.jpg", "/jewelry/bracelet-beaded-pastel.jpg"],
    alt: "Гривна от зелени и черни мъниста",
    description: "Зелени и черни мъниста в спокоен ритъм, с малка метална вложка в средата.",
    details: ["Стъклени мъниста 4–6 мм", "Ластичен шнур", "Метална вложка по избор"],
    materials: ["Мъниста", "Стъкло"],
    features: ["Ръчно изработено"],
    defaultMetal: "gold",
    inStock: true,
  },
  {
    slug: "perlena-luna-grivna",
    name: "Гривна Перлена луна",
    category: C.bracelets,
    price: 44,
    image: "/jewelry/bracelet-gold-pearl.jpg",
    hoverImage: "/jewelry/bracelet-gold-wrist.jpg",
    gallery: ["/jewelry/bracelet-gold-pearl.jpg", "/jewelry/bracelet-gold-wrist.jpg"],
    alt: "Гривна от златисти и бели перлени мъниста",
    description: "Сладководни перли, редувани със златисти мъниста. Нежна и празнична.",
    details: ["Сладководни перли 4 мм", "Метални мъниста", "Нанизана на ръка"],
    materials: ["Перли", "Мъниста"],
    features: ["Ръчно изработено", "Готово за подарък"],
    defaultMetal: "gold",
    inStock: false,
  },
  {
    slug: "lyatna-valna-grivna-krak",
    name: "Гривна за крак Лятна вълна",
    category: C.anklets,
    price: 36,
    image: "/jewelry/anklet-gold-slipper.jpg",
    hoverImage: "/jewelry/anklet-feet.jpg",
    gallery: ["/jewelry/anklet-gold-slipper.jpg", "/jewelry/anklet-feet.jpg", "/jewelry/anklet-silver-close.jpg"],
    alt: "Тънка златна гривна за крак на глезен до чехъл",
    description: "Най-тънката ни верижка за глезен. Не се заплита и не дразни, дори на плажа.",
    details: ["Верижка 1 мм", "Удължител 3 см", "Устойчива на вода и пясък"],
    materials: ["Верижка"],
    features: ["Ръчно изработено", "Хипоалергенно"],
    badge: "Бестселър",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "srebaren-zvan-grivna-krak",
    name: "Гривна за крак Сребърен звън",
    category: C.anklets,
    price: 39,
    image: "/jewelry/anklet-silver-bw.jpg",
    hoverImage: "/jewelry/anklet-silver-close.jpg",
    gallery: ["/jewelry/anklet-silver-bw.jpg", "/jewelry/anklet-silver-close.jpg"],
    alt: "Сребърна гривна за крак със ситни звънчета",
    description: "Верижка с малки звънчета, които едва се чуват при всяка крачка.",
    details: ["Ситни звънчета", "Удължител 3 см", "Затваряне с карабинер"],
    materials: ["Верижка"],
    features: ["Ръчно изработено", "Ограничена серия"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "kambanki-grivna-krak",
    name: "Гривна за крак Камбанки",
    category: C.anklets,
    price: 42,
    image: "/jewelry/anklet-bells.jpg",
    gallery: ["/jewelry/anklet-bells.jpg", "/jewelry/anklet-feet.jpg"],
    alt: "Гривна за крак с камбанки върху боси крака",
    description: "По-плътна верижка с камбанки по целия ред, вдъхновена от старите накити.",
    details: ["Двоен ред верижка", "Камбанки по цялата дължина", "Удължител 3 см"],
    materials: ["Верижка"],
    features: ["Ръчно изработено"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "kapka-svetlina-gerdan",
    name: "Гердан Капка светлина",
    category: C.necklaces,
    price: 64,
    image: "/jewelry/necklace-gold-drop.jpg",
    hoverImage: "/jewelry/necklace-portrait.jpg",
    gallery: ["/jewelry/necklace-gold-drop.jpg", "/jewelry/necklace-portrait.jpg", "/jewelry/necklace-gold-pendant.jpg"],
    alt: "Златен гердан с висулка капка на манекен",
    description: "Висулка капка, излята и полирана на ръка. Тежи точно колкото да се усеща.",
    details: ["Висулка 18 мм", "Верижка 1,2 мм", "Удължител 5 см"],
    materials: ["Висулка", "Верижка"],
    features: ["Ръчно изработено", "Готово за подарък"],
    badge: "Бестселър",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "tsvete-gerdan",
    name: "Гердан Цвете",
    category: C.necklaces,
    price: 58,
    image: "/jewelry/necklace-flower.jpg",
    gallery: ["/jewelry/necklace-flower.jpg", "/jewelry/necklace-gold-fine.jpg"],
    alt: "Гердан с висулка цвете на бял фон",
    description: "Малко цвете в две тонални нюанси. Носи се високо, близо до ключицата.",
    details: ["Висулка 14 мм", "Верижка тип котва", "Удължител 5 см"],
    materials: ["Висулка", "Верижка"],
    features: ["Ръчно изработено"],
    badge: "Ново",
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "sartse-gerdan",
    name: "Гердан Сърце в длан",
    category: C.necklaces,
    price: 52,
    image: "/jewelry/necklace-heart-hand.jpg",
    hoverImage: "/jewelry/necklace-heart-silver.jpg",
    gallery: ["/jewelry/necklace-heart-hand.jpg", "/jewelry/necklace-heart-silver.jpg"],
    alt: "Ръка държи гердан със златно сърце",
    description: "Сърце, което може да носи инициал от двете страни. Най-даряваният ни гердан.",
    details: ["Сърце 10 мм", "Гравиране на две страни", "Удължител 5 см"],
    materials: ["Висулка", "Верижка"],
    features: ["Ръчно изработено", "Възможно гравиране", "Готово за подарък"],
    badge: "Подарък",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "perlena-dantela-gerdan",
    name: "Гердан Перлена дантела",
    category: C.necklaces,
    price: 72,
    image: "/jewelry/necklace-pearl-lace.jpg",
    hoverImage: "/jewelry/necklace-pearl-stone.jpg",
    gallery: ["/jewelry/necklace-pearl-lace.jpg", "/jewelry/necklace-pearl-stone.jpg"],
    alt: "Бял гердан от ситни мъниста във формата на дантела",
    description: "Стотици ситни мъниста, изплетени като дантела. Около шест часа работа за един гердан.",
    details: ["Японски мъниста", "Плетка на ръка", "Метална закопчалка по избор"],
    materials: ["Мъниста", "Перли"],
    features: ["Ръчно изработено", "Ограничена серия"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "medalyon-gerdan",
    name: "Верижка Медальон",
    category: C.necklaces,
    price: 56,
    image: "/jewelry/necklace-medallion.jpg",
    hoverImage: "/jewelry/necklace-gold-textile.jpg",
    gallery: ["/jewelry/necklace-medallion.jpg", "/jewelry/necklace-gold-textile.jpg"],
    alt: "Сребърна верижка с малък медальон",
    description: "Малък кръгъл медальон с ръчна текстура, като стара монета.",
    details: ["Медальон 12 мм", "Ръчно чукана текстура", "Удължител 5 см"],
    materials: ["Висулка", "Верижка"],
    features: ["Ръчно изработено", "Хипоалергенно"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "zora-halki-obetsi",
    name: "Обеци Халки Зора",
    category: C.earrings,
    price: 44,
    image: "/jewelry/earrings-hoops-pink.jpg",
    hoverImage: "/jewelry/ring-gold-pile.jpg",
    gallery: ["/jewelry/earrings-hoops-pink.jpg", "/jewelry/ring-flatlay.jpg"],
    alt: "Малки златни обеци халки в розова керамична чинийка",
    description: "Плътни малки халки, огънати и полирани на ръка. Носят се всеки ден, дори за сън.",
    details: ["Винтово закопчаване", "Около 1,5 или 3 см", "Без никел"],
    materials: ["Метал"],
    features: ["Ръчно изработено", "Хипоалергенно"],
    badge: "Ново",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "srebarni-kapki-obetsi",
    name: "Обеци Сребърни капки",
    category: C.earrings,
    price: 46,
    image: "/jewelry/earrings-silver-branch.jpg",
    hoverImage: "/jewelry/earrings-cards.jpg",
    gallery: ["/jewelry/earrings-silver-branch.jpg", "/jewelry/earrings-cards.jpg"],
    alt: "Ръчно изработени сребърни висящи обеци на клонка",
    description: "Висящи капки с матова повърхност, които улавят светлината при движение.",
    details: ["Кукички", "Матово полиране", "Без никел"],
    materials: ["Метал"],
    features: ["Ръчно изработено"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "slantse-prasten",
    name: "Пръстен Слънце",
    category: C.rings,
    price: 39,
    image: "/jewelry/ring-gold-studded.jpg",
    hoverImage: "/jewelry/ring-gold-pile.jpg",
    gallery: ["/jewelry/ring-gold-studded.jpg", "/jewelry/ring-gold-pile.jpg", "/jewelry/ring-flatlay.jpg"],
    alt: "Три златни пръстена с текстура на бял фон",
    description: "Широк пръстен с ръчно набита текстура. Хубав сам и още по-хубав на купчинка.",
    details: ["Ширина 4 мм", "Ръчно набита текстура", "Размери 50–58"],
    materials: ["Метал"],
    features: ["Ръчно изработено"],
    badge: "Бестселър",
    defaultMetal: "gold",
    featured: true,
    inStock: true,
  },
  {
    slug: "tanka-liniya-prasten",
    name: "Пръстен Тънка линия",
    category: C.rings,
    price: 32,
    image: "/jewelry/ring-two-tone-hand.jpg",
    hoverImage: "/jewelry/ring-palm.jpg",
    gallery: ["/jewelry/ring-two-tone-hand.jpg", "/jewelry/ring-palm.jpg"],
    alt: "Ръка с два тънки пръстена, златен и сребърен",
    description: "Тънка халка от 1,5 мм за всеки пръст. Вземи две в различен метал.",
    details: ["Ширина 1,5 мм", "Полирана", "Размери 50–58"],
    materials: ["Метал"],
    features: ["Ръчно изработено", "Хипоалергенно"],
    defaultMetal: "silver",
    inStock: true,
  },
  {
    slug: "makrame-klyuchodarzhatel",
    name: "Ключодържател Макраме",
    category: C.keychains,
    price: 18,
    image: "/jewelry/keychain-macrame-wristlet.jpg",
    hoverImage: "/jewelry/keychain-macrame-board.jpg",
    gallery: ["/jewelry/keychain-macrame-wristlet.jpg", "/jewelry/keychain-macrame-board.jpg"],
    alt: "Цветни ключодържатели макраме, закачени на табло",
    description: "Плетен памучен шнур с метална халка. Може да се носи и на китката.",
    details: ["100% памучен шнур", "Метална халка и карабинер", "Цвят на шнура по избор при поръчка"],
    materials: ["Макраме", "Памук"],
    features: ["Ръчно изработено", "Готово за подарък"],
    badge: "Бестселър",
    defaultMetal: "silver",
    featured: true,
    inStock: true,
  },
  {
    slug: "manista-klyuchodarzhatel",
    name: "Ключодържател Мъниста",
    category: C.keychains,
    price: 16,
    image: "/jewelry/keychain-beaded-charms.jpg",
    hoverImage: "/jewelry/keychain-beaded-striped.jpg",
    gallery: ["/jewelry/keychain-beaded-charms.jpg", "/jewelry/keychain-beaded-striped.jpg"],
    alt: "Цветни ключодържатели от мъниста с висулки",
    description: "Шарени мъниста и малка висулка. Всеки е различен, като малък талисман.",
    details: ["Стъклени и дървени мъниста", "Метална халка", "Висулка изненада"],
    materials: ["Мъниста"],
    features: ["Ръчно изработено"],
    defaultMetal: "gold",
    inStock: true,
  },
  {
    slug: "zlatna-halka-klyuchodarzhatel",
    name: "Ключодържател Халка",
    category: C.keychains,
    price: 22,
    image: "/jewelry/keychain-gold-hand.jpg",
    gallery: ["/jewelry/keychain-gold-hand.jpg", "/jewelry/keychain-beaded-charms.jpg"],
    alt: "Ръка държи метален ключодържател с халка",
    description: "Изчистена метална халка с място за гравиране на име или дата.",
    details: ["Плочка за гравиране", "Здрава двойна халка", "Подаръчна кутийка"],
    materials: ["Метал"],
    features: ["Ръчно изработено", "Възможно гравиране", "Готово за подарък"],
    defaultMetal: "gold",
    inStock: true,
  },
];

export const categories = categoryList.map((category) => category.name);

export function getCategoryByName(name: string) {
  return categoryList.find((category) => category.name === name);
}

export function getCategoryBySlug(slug: string) {
  return categoryList.find((category) => category.slug === slug);
}

export function getCategoryHref(category: Category) {
  return `/shop?category=${encodeURIComponent(category.name)}`;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 4) {
  const current = getProduct(slug);
  const rest = products.filter((product) => product.slug !== slug && isInStock(product));
  const sameCategory = rest.filter((product) => product.category === current?.category);
  return [...sameCategory, ...rest.filter((product) => product.category !== current?.category)].slice(0, limit);
}

export function getVariantPrice(product: Product, metal: Metal) {
  return product.price + (metal === "gold" ? GOLD_SURCHARGE : 0);
}

export function getSizes(product: Product) {
  const category = getCategoryByName(product.category);
  return {
    label: category?.sizeLabel ?? "Размер",
    sizes: category?.sizes ?? ["Един размер"],
    defaultSize: category?.defaultSize ?? "Един размер",
    hint: category?.sizeHint ?? "",
  };
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function isInStock(product: Product) {
  return product.inStock !== false;
}
