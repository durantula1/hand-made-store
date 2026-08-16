export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  gallery: string[];
  alt: string;
  description: string;
  details: string[];
  materials: string[];
  colors: string[];
  features: string[];
  featured?: boolean;
  inStock?: boolean;
};

export const products: Product[] = [
  {
    slug: "pearl-earrings",
    name: "Перлени обеци Дъга",
    category: "Бижута",
    price: 64,
    image: "/products/pearl-earrings.png",
    gallery: [
      "/products/pearl-earrings.png",
      "/lifestyle/collection-inset-portrait.png",
      "/lifestyle/collage-jewelry.png",
    ],
    alt: "Ръчно изработени висящи перлени обеци със златни кукички върху керамична чинийка",
    featured: true,
    inStock: true,
    description:
      "Фини сладководни перли, оформени в лек чифт за тихи вечери, ленени рокли и летни поводи.",
    details: ["Сладководни перли", "Кукички със златно покритие", "Изработени в малки серии"],
    materials: ["Перла", "Златно покритие"],
    colors: ["Перлено", "Златно"],
    features: ["Ръчно изработено", "Ограничена серия"],
  },
  {
    slug: "ceramic-vase",
    name: "Ваза с ливадна глазура",
    category: "Керамика",
    price: 78,
    image: "/products/ceramic-vase.png",
    gallery: [
      "/products/ceramic-vase.png",
      "/lifestyle/promo-ceramics.png",
      "/lifestyle/about-studio.png",
    ],
    alt: "Малка ръчно изработена керамична ваза с ливадна глазура и сух стрък",
    featured: true,
    inStock: true,
    description:
      "Леко несиметрична ваза с ръчно потопена глазура за единични стръкове, первази и бавни закуски.",
    details: ["Ръчно оформена каменина", "Глазура, безопасна за храна", "Всяко изделие е леко различно"],
    materials: ["Каменина"],
    colors: ["Салвия", "Крем"],
    features: ["Ръчно изработено", "Единствена бройка"],
  },
  {
    slug: "soy-candle",
    name: "Свещ Неделен лен",
    category: "Аромати за дома",
    price: 42,
    image: "/products/soy-candle.png",
    gallery: [
      "/products/soy-candle.png",
      "/lifestyle/ig-botanical.png",
      "/lifestyle/about-studio.png",
    ],
    alt: "Ръчно налята соева свещ в малка керамична чашка върху топъл лен",
    featured: true,
    inStock: true,
    description:
      "Ръчно налята соева свещ с чист памук, лимонов лист и мека лавандула в керамична чашка за повторна употреба.",
    details: ["Соева восъчна смес", "Керамичен съд за повторна употреба", "Приблизително 38 часа горене"],
    materials: ["Соев восък", "Каменина"],
    colors: ["Крем", "Глина"],
    features: ["Ръчно изработено", "Готово за подарък"],
  },
  {
    slug: "linen-pouch",
    name: "Ленено калъфче Градински бод",
    category: "Текстил",
    price: 36,
    image: "/products/linen-pouch.png",
    gallery: [
      "/products/linen-pouch.png",
      "/lifestyle/promo-bags.png",
      "/lifestyle/collage-crystal.png",
    ],
    alt: "Тъкано ленено калъфче с връзка и бродиран флорален детайл",
    inStock: false,
    description:
      "Малко тъкано ленено калъфче с флорален бод за бижута, пътни дреболии или малък подарък.",
    details: ["Омекотена ленена смес", "Памучна връзка", "Ръчно бродиран детайл"],
    materials: ["Лен", "Памук"],
    colors: ["Крем", "Маслинено"],
    features: ["Ръчно изработено", "Малка серия"],
  },
  {
    slug: "botanical-soaps",
    name: "Трио ботанически сапуни",
    category: "Грижа за себе си",
    price: 29,
    image: "/products/botanical-soaps.png",
    gallery: [
      "/products/botanical-soaps.png",
      "/lifestyle/ig-botanical.png",
      "/lifestyle/collage-crystal.png",
    ],
    alt: "Три ръчно изработени ботанически сапуна с пресовани цветни листенца",
    inStock: true,
    description:
      "Три кремообразни ботанически сапуна с нежни флорални текстури, опаковани като свеж и внимателен подарък.",
    details: ["Растителни масла", "Лек ботанически аромат", "Рециклируема хартиена опаковка"],
    materials: ["Растителни масла"],
    colors: ["Глина", "Ботаническо"],
    features: ["Ръчно изработено", "Готово за подарък"],
  },
];

export const categories = Array.from(new Set(products.map((product) => product.category)));

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 3) {
  const current = getProduct(slug);
  const rest = products.filter((product) => product.slug !== slug);
  const sameCategory = rest.filter((product) => product.category === current?.category);
  return [...sameCategory, ...rest.filter((product) => product.category !== current?.category)].slice(0, limit);
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
