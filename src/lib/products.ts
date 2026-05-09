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
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "pearl-earrings",
    name: "Pearl Arc Earrings",
    category: "Jewelry",
    price: 64,
    image: "/products/pearl-earrings.png",
    alt: "Handmade pearl drop earrings with gold details on a small ceramic dish",
    tint: "blush",
    featured: true,
    description:
      "Delicate freshwater pearls shaped into a light-catching pair for quiet dinners, linen dresses, and warm-weather ceremonies.",
    details: ["Freshwater pearls", "Gold-filled hooks", "Made in small batches"],
  },
  {
    slug: "ceramic-vase",
    name: "Meadow Glaze Vase",
    category: "Ceramics",
    price: 78,
    image: "/products/ceramic-vase.png",
    alt: "Small handmade ceramic bud vase with meadow flowers in soft daylight",
    tint: "sage",
    featured: true,
    description:
      "A softly irregular bud vase with a hand-dipped glaze, made for single stems, windowsills, and breakfast tables.",
    details: ["Hand-thrown stoneware", "Food-safe glaze", "Each piece varies subtly"],
  },
  {
    slug: "soy-candle",
    name: "Sunday Linen Candle",
    category: "Home Scent",
    price: 42,
    image: "/products/soy-candle.png",
    alt: "Hand-poured soy candle in a small ceramic cup on pastel linen",
    tint: "lavender",
    featured: true,
    description:
      "A hand-poured soy candle with notes of clean cotton, lemon leaf, and soft lavender, poured into a reusable ceramic cup.",
    details: ["Soy wax blend", "Reusable ceramic vessel", "Approximately 38 hour burn"],
  },
  {
    slug: "linen-pouch",
    name: "Garden Stitch Pouch",
    category: "Textiles",
    price: 36,
    image: "/products/linen-pouch.png",
    alt: "Woven linen pouch with a drawstring and embroidered floral detail",
    tint: "blue",
    description:
      "A small woven linen pouch finished with a floral stitch, sized for jewelry, travel keepsakes, or a tiny gift.",
    details: ["Washed linen blend", "Cotton drawstring", "Hand embroidered detail"],
  },
  {
    slug: "botanical-soaps",
    name: "Botanical Soap Trio",
    category: "Self Care",
    price: 29,
    image: "/products/botanical-soaps.png",
    alt: "Three handmade botanical soaps with pressed flower petals",
    tint: "butter",
    description:
      "Three creamy botanical soaps pressed with soft floral textures and wrapped for a fresh, thoughtful gift.",
    details: ["Plant oils", "Light botanical scent", "Wrapped in recyclable paper"],
  },
];

export const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}
