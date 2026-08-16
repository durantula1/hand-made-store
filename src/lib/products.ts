export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
  tint: string;
  description: string;
  details: string[];
  materials: string[];
  colors: string[];
  features: string[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "pearl-earrings",
    name: "Перлени обеци Дъга",
    category: "Бижута",
    price: 64,
    image: "/products/pearl-earrings.png",
    alt: "Ръчно изработени висящи перлени обеци със златни детайли върху малка керамична чинийка",
    tint: "blush",
    featured: true,
    description:
      "Фини сладководни перли, оформени в лек чифт за тихи вечери, ленени рокли и летни поводи.",
    details: ["Сладководни перли", "Кукички със златно покритие", "Изработени в малки серии"],
    materials: ["Перла", "Златно покритие"],
    colors: ["Перлено", "Златно"],
    features: ["Готово за подарък", "Малка серия"],
  },
  {
    slug: "ceramic-vase",
    name: "Ваза с ливадна глазура",
    category: "Керамика",
    price: 78,
    image: "/products/ceramic-vase.png",
    alt: "Малка ръчно изработена керамична ваза с ливадни цветя на мека дневна светлина",
    tint: "sage",
    featured: true,
    description:
      "Леко несиметрична ваза с ръчно потопена глазура за единични стръкове, первази и бавни закуски.",
    details: ["Ръчно оформена каменинa", "Глазура, безопасна за храна", "Всяко изделие е леко различно"],
    materials: ["Каменина"],
    colors: ["Салвия", "Крем"],
    features: ["Единствена бройка", "Малка серия"],
  },
  {
    slug: "soy-candle",
    name: "Свещ Неделен лен",
    category: "Аромати за дома",
    price: 42,
    image: "/products/soy-candle.png",
    alt: "Ръчно налята соева свещ в малка керамична чашка върху пастелен лен",
    tint: "lavender",
    featured: true,
    description:
      "Ръчно налята соева свещ с чист памук, лимонов лист и мека лавандула в керамична чашка за повторна употреба.",
    details: ["Соева восъчна смес", "Керамичен съд за повторна употреба", "Приблизително 38 часа горене"],
    materials: ["Соев восък", "Каменина"],
    colors: ["Лавандула", "Крем"],
    features: ["Готово за подарък", "Готово за изпращане"],
  },
  {
    slug: "linen-pouch",
    name: "Ленено калъфче Градински бод",
    category: "Текстил",
    price: 36,
    image: "/products/linen-pouch.png",
    alt: "Тъкано ленено калъфче с връзка и бродиран флорален детайл",
    tint: "blue",
    description:
      "Малко тъкано ленено калъфче с флорален бод за бижута, пътни дреболии или малък подарък.",
    details: ["Омекотена ленена смес", "Памучна връзка", "Ръчно бродиран детайл"],
    materials: ["Лен", "Памук"],
    colors: ["Синьо", "Крем"],
    features: ["Готово за подарък", "Малка серия"],
  },
  {
    slug: "botanical-soaps",
    name: "Трио ботанически сапуни",
    category: "Грижа за себе си",
    price: 29,
    image: "/products/botanical-soaps.png",
    alt: "Три ръчно изработени ботанически сапуна с пресовани цветни листенца",
    tint: "butter",
    description:
      "Три кремообразни ботанически сапуна с нежни флорални текстури, опаковани като свеж и внимателен подарък.",
    details: ["Растителни масла", "Лек ботанически аромат", "Рециклируема хартиена опаковка"],
    materials: ["Растителни масла"],
    colors: ["Маслено жълто", "Ботаническо"],
    features: ["Готово за подарък", "Готово за изпращане"],
  },
];

export const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}
