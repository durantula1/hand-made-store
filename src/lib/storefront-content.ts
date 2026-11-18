export const FREE_SHIPPING_THRESHOLD = 80;

export const announcements = [
  `Безплатна доставка над ${FREE_SHIPPING_THRESHOLD} €`,
  "30 дни за връщане и замяна",
  "Подаръчна кутийка към всяка поръчка",
];

export const announcement = announcements[0];

export const collectionLinks = [
  { label: "Гривни за ръка", href: "/shop?category=Гривни+за+ръка", italic: false },
  { label: "Гривни за крак", href: "/shop?category=Гривни+за+крак", italic: true },
  { label: "Гердани", href: "/shop?category=Гердани", italic: false },
  { label: "Ключодържатели", href: "/shop?category=Ключодържатели", italic: true },
];

export const menuSecondaryLinks = [
  { label: "Подаръци", href: "/shop?feature=Готово+за+подарък" },
  { label: "Бестселъри", href: "/shop?sort=featured" },
  { label: "Гравиране", href: "/shop?feature=Възможно+гравиране" },
  { label: "Студиото", href: "/#story" },
];

export const menuHelpLinks = [
  { label: "Доставка и връщане", href: "/#faq" },
  { label: "Как да избера размер", href: "/#size-guide" },
  { label: "Грижа за бижутата", href: "/#journal" },
];

export const trustPoints = [
  {
    icon: "hand",
    title: "Ръчна изработка",
    text: "Всяко бижу е нанизано, огънато и полирано в студиото ни в София.",
  },
  {
    icon: "truck",
    title: `Безплатна доставка над ${FREE_SHIPPING_THRESHOLD} €`,
    text: "Изпращаме до 2 работни дни с Еконт или Спиди, с преглед.",
  },
  {
    icon: "return",
    title: "30 дни за връщане",
    text: "Не става размерът? Заменяме го безплатно.",
  },
  {
    icon: "shield",
    title: "1 година гаранция",
    text: "Сребро 925 и 18К позлата, без никел. Поправяме безплатно.",
  },
] as const;

export const values = [
  {
    n: "01",
    title: "Направено на ръка",
    text: "Без машинна серия. Всяко мънисто и всяка халка минават през ръцете ни.",
  },
  {
    n: "02",
    title: "Материали, които издържат",
    text: "Сребро 925 и дебела 18К позлата, които не потъмняват от вода и време.",
  },
  {
    n: "03",
    title: "Опаковка без пластмаса",
    text: "Хартиена кутийка, памучна торбичка и картичка за подарък, които се рециклират.",
  },
];

export const faqs = [
  {
    q: "Каква е разликата между злато и сребро?",
    a: "Сребърният вариант е от сребро 925. Златният е от същото сребро с дебело 18-каратово златно покритие (vermeil), затова е с 8 € по-скъп.",
  },
  {
    q: "Колко време отнема доставката?",
    a: "Изработваме и опаковаме до 1–2 работни дни. Доставката в България е 1–3 дни с Еконт или Спиди. Над 80 € е безплатна.",
  },
  {
    q: "Как да избера размер?",
    a: "Измери китката, глезена или пръста с мека лента. Под всеки продукт има таблица с размери. Ако не стане, заменяме безплатно до 30 дни.",
  },
  {
    q: "Мога ли да върна бижу?",
    a: "Да, до 30 дни в оригинален вид и опаковка. Обеците не се връщат по хигиенни причини, освен при дефект.",
  },
  {
    q: "Какви начини на плащане приемате?",
    a: "Карта (Visa, Mastercard), Apple Pay, Google Pay и наложен платеж.",
  },
];

export const countdownCopy = {
  title: "Черен петък в Lunéa",
  text: "На 27 ноември всички гривни за ръка и крак са с −20%. Абонирай се, за да пазаруваш час по-рано.",
};

export const trendsSlides = [
  {
    label: "Колекция Лято",
    title: "Гривни за боси крака",
    text: "Тънки верижки и звънчета за плаж, сандали и дълги вечери.",
    href: "/shop?category=Гривни+за+крак",
    image: "/jewelry/anklet-feet.jpg",
  },
  {
    label: "Колекция Перли",
    title: "Перли, нанизани като дантела",
    text: "Гердани и гривни от ситни мъниста, плетени по шест часа.",
    href: "/shop?category=Гердани",
    image: "/jewelry/necklace-pearl-stone.jpg",
  },
  {
    label: "Малки подаръци",
    title: "Ключодържатели с характер",
    text: "Макраме и мъниста за ключове, чанти и раници.",
    href: "/shop?category=Ключодържатели",
    image: "/jewelry/keychain-macrame-board.jpg",
  },
];

export const articles = [
  {
    title: "Как да измериш китката и глезена си",
    href: "/#size-guide",
    image: "/jewelry/bracelet-hands-flowers.jpg",
  },
  {
    title: "Злато или сребро: кое подхожда на кожата ти",
    href: "/#faq",
    image: "/jewelry/bracelet-silver-arms.jpg",
  },
  {
    title: "Грижа за бижутата: вода, парфюм, съхранение",
    href: "/#faq",
    image: "/jewelry/flatlay-flowers.jpg",
  },
];

// layer: 1 близък (голям, рязък), 2 среден, 3 далечен (малък, замъглен, блед).
// tilt — начален наклон (°), drift — промяна на наклона при скрол (°),
// dur/delay — люлеене (сек), d — позиция на десктоп (%), m — позиция на мобилно (null = скрита).
export type InstagramPost = {
  src: string;
  layer: 1 | 2 | 3;
  width: number;
  height: number;
  tilt: number;
  drift: number;
  dur: number;
  delay: number;
  d: { l?: number; r?: number; t?: number; b?: number };
  m: { l: number; t?: number; b?: number } | null;
};

export const instagramPosts: InstagramPost[] = [
  { src: "/jewelry/necklace-portrait.jpg", layer: 1, width: 168, height: 224, tilt: -6, drift: 6, dur: 8, delay: 0, d: { l: 2, t: 10 }, m: { l: 34, t: 0.8 } },
  { src: "/jewelry/bracelet-wrist-hand.jpg", layer: 1, width: 176, height: 220, tilt: 5, drift: -8, dur: 9, delay: -3, d: { r: 2, t: 44 }, m: { l: 62, b: 0.8 } },
  { src: "/jewelry/earrings-face.jpg", layer: 1, width: 164, height: 214, tilt: 8, drift: -8, dur: 7, delay: -5, d: { l: 6, b: 4 }, m: null },
  { src: "/jewelry/ring-gold-pile.jpg", layer: 2, width: 128, height: 170, tilt: -4, drift: 7, dur: 10, delay: -2, d: { r: 5, t: 6 }, m: { l: 70, t: 1.8 } },
  { src: "/jewelry/necklace-pearl-lace.jpg", layer: 2, width: 136, height: 168, tilt: 7, drift: -7, dur: 6, delay: -4, d: { l: 1, t: 40 }, m: null },
  { src: "/jewelry/bracelet-hands-flowers.jpg", layer: 2, width: 140, height: 176, tilt: -7, drift: 7, dur: 9, delay: -1, d: { r: 3, b: 3 }, m: { l: 6, b: 0.8 } },
  { src: "/jewelry/keychain-beaded-charms.jpg", layer: 2, width: 132, height: 164, tilt: 3, drift: -3, dur: 8, delay: -6, d: { l: 40, b: 2 }, m: null },
  { src: "/jewelry/anklet-silver-close.jpg", layer: 3, width: 92, height: 122, tilt: 6, drift: -6, dur: 7, delay: -2, d: { l: 38, t: 5 }, m: { l: 8, t: 2.4 } },
  { src: "/jewelry/flatlay-flowers.jpg", layer: 3, width: 100, height: 120, tilt: -5, drift: 5, dur: 10, delay: -7, d: { r: 28, t: 8 }, m: null },
  { src: "/jewelry/earrings-hoops-pink.jpg", layer: 3, width: 90, height: 118, tilt: 4, drift: -6, dur: 6, delay: -3, d: { l: 22, b: 8 }, m: { l: 40, b: 2.4 } },
  { src: "/jewelry/necklace-heart-hand.jpg", layer: 3, width: 94, height: 124, tilt: -8, drift: 8, dur: 9, delay: -5, d: { r: 22, b: 6 }, m: null },
  { src: "/jewelry/necklace-medallion.jpg", layer: 2, width: 126, height: 164, tilt: 6, drift: -6, dur: 8, delay: -4, d: { l: 19, t: 5 }, m: null },
  { src: "/jewelry/ring-gold-studded.jpg", layer: 2, width: 130, height: 168, tilt: -6, drift: 6, dur: 9, delay: -2, d: { r: 17, t: 3 }, m: null },
  { src: "/jewelry/earrings-silver-branch.jpg", layer: 2, width: 128, height: 166, tilt: -5, drift: 5, dur: 7, delay: -6, d: { l: 56, b: 4 }, m: null },
  { src: "/jewelry/bracelet-gold-wrist.jpg", layer: 3, width: 90, height: 118, tilt: 7, drift: -7, dur: 10, delay: -1, d: { l: 15, t: 45 }, m: null },
  { src: "/jewelry/necklace-gold-fine.jpg", layer: 3, width: 92, height: 120, tilt: -6, drift: 6, dur: 8, delay: -3, d: { r: 17, t: 43 }, m: null },
];

export const footerColumns = [
  {
    title: "Магазин",
    links: [
      { label: "Всички бижута", href: "/shop" },
      { label: "Гривни за ръка", href: "/shop?category=Гривни+за+ръка" },
      { label: "Гривни за крак", href: "/shop?category=Гривни+за+крак" },
      { label: "Гердани", href: "/shop?category=Гердани" },
      { label: "Обеци", href: "/shop?category=Обеци" },
      { label: "Пръстени", href: "/shop?category=Пръстени" },
      { label: "Ключодържатели", href: "/shop?category=Ключодържатели" },
    ],
  },
  {
    title: "Помощ",
    links: [
      { label: "Доставка и плащане", href: "/#faq" },
      { label: "Връщане и замяна", href: "/#faq" },
      { label: "Таблица с размери", href: "/#size-guide" },
      { label: "Гаранция", href: "/#faq" },
    ],
  },
  {
    title: "Студио",
    links: [
      { label: "За нас", href: "/#story" },
      { label: "Дневник", href: "/#journal" },
      { label: "Пиши ни", href: "mailto:hello@luneahandmade.example" },
    ],
  },
];

export const countdownTarget = "2026-11-27T00:00:00+02:00";

export const returnPolicy =
  "Можеш да върнеш или замениш бижу до 30 дни след получаване, в оригинален вид и опаковка. Замяната на размер е безплатна. Обеците не подлежат на връщане по хигиенни причини, освен при дефект.";

export const customerService =
  "Всяко бижу има 1 година гаранция. Ако се скъса закопчалка или падне мънисто, го поправяме безплатно. Пиши ни на hello@luneahandmade.example.";

export const shippingInfo =
  "Изработваме и опаковаме до 1–2 работни дни. Доставка до офис или адрес на Еконт и Спиди за 1–3 дни, с възможност за преглед. Над 80 € е безплатна.";

export const careInfo =
  "Сваляй бижутата преди душ, басейн и спорт. Пази ги от парфюм и кремове. Съхранявай ги в торбичката, за да не се драскат. Сребърните почиствай с мека кърпа.";

export const sizeGuide =
  "Измери с мека шивашка лента или с конец и линийка. Ако си между два размера, вземи по-големия. Ако не стане, заменяме безплатно.";
