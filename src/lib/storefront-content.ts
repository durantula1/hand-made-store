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

export const instagramPosts = [
  { src: "/jewelry/bracelet-wrist-hand.jpg", speed: -75, width: 120, height: 168 },
  { src: "/jewelry/ring-gold-pile.jpg", speed: -50, width: 120, height: 180 },
  { src: "/jewelry/necklace-portrait.jpg", speed: -150, width: 132, height: 198 },
  { src: "/jewelry/anklet-silver-close.jpg", speed: -100, width: 108, height: 200 },
  { src: "/jewelry/flatlay-flowers.jpg", speed: -85, width: 176, height: 118 },
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
