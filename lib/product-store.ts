import type { Product, ProductInput } from "@/lib/types";

const STORAGE_KEY = "product-master:products";

type Listener = () => void;

let products: Product[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function seedProducts(): Product[] {
  const base: Array<Omit<Product, "id">> = [
    {
      name: "オーガニックコットンTシャツ",
      sku: "TOP-1001",
      category: "トップス",
      brand: "Nordwell",
      price: 3900,
      salePrice: null,
      stock: 42,
      status: "published",
      imageUrl: "",
      description:
        "厚手のオーガニックコットンを使用したベーシックTシャツ。洗濯による型崩れが少なく、通年で使いやすい一着です。",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ホワイト", "ブラック", "ネイビー"],
      createdAt: daysAgo(120),
      updatedAt: daysAgo(2),
    },
    {
      name: "ウールブレンドテーラードジャケット",
      sku: "OUT-2001",
      category: "アウター",
      brand: "Nordwell",
      price: 24800,
      salePrice: 19800,
      stock: 0,
      status: "published",
      imageUrl: "",
      description:
        "ウール混素材で軽さと保温性を両立したテーラードジャケット。オフィスカジュアルにも対応できるシルエット。",
      sizes: ["M", "L"],
      colors: ["チャコール"],
      createdAt: daysAgo(200),
      updatedAt: daysAgo(1),
    },
    {
      name: "ストレッチスキニーデニム",
      sku: "BTM-3001",
      category: "ボトムス",
      brand: "Alto Blue",
      price: 8900,
      salePrice: null,
      stock: 15,
      status: "published",
      imageUrl: "",
      description: "適度なストレッチ性を持たせたスキニーシルエットのデニムパンツ。",
      sizes: ["S", "M", "L"],
      colors: ["インディゴ", "ブラック"],
      createdAt: daysAgo(180),
      updatedAt: daysAgo(15),
    },
    {
      name: "レザーローファー",
      sku: "SHO-4001",
      category: "シューズ",
      brand: "Camden Foot",
      price: 15800,
      salePrice: null,
      stock: 3,
      status: "published",
      imageUrl: "",
      description: "天然皮革を使用したローファー。履くほどに足に馴染むソフトな作り。",
      sizes: ["24.5", "25", "25.5", "26", "26.5", "27"],
      colors: ["ブラウン", "ブラック"],
      createdAt: daysAgo(90),
      updatedAt: daysAgo(30),
    },
    {
      name: "キャンバストートバッグ",
      sku: "BAG-5001",
      category: "バッグ",
      brand: "Alto Blue",
      price: 5400,
      salePrice: null,
      stock: 0,
      status: "unpublished",
      imageUrl: "",
      description: "厚手キャンバス生地のA4対応トートバッグ。内ポケット2つ付き。",
      sizes: [],
      colors: ["ベージュ", "ブラック"],
      createdAt: daysAgo(60),
      updatedAt: daysAgo(40),
    },
    {
      name: "シルバーチェーンネックレス",
      sku: "ACC-6001",
      category: "アクセサリー",
      brand: "Mira Studio",
      price: 6200,
      salePrice: null,
      stock: 8,
      status: "published",
      imageUrl: "",
      description: "925シルバー製のチェーンネックレス。長さ調整可能。",
      sizes: [],
      colors: ["シルバー"],
      createdAt: daysAgo(45),
      updatedAt: daysAgo(3),
    },
    {
      name: "リブニットカーディガン",
      sku: "TOP-1002",
      category: "トップス",
      brand: "Mira Studio",
      price: 7800,
      salePrice: 6200,
      stock: 21,
      status: "published",
      imageUrl: "",
      description: "リブ編みのミドルゲージニットカーディガン。1枚でも羽織りとしても使える。",
      sizes: ["S", "M", "L"],
      colors: ["オートミール", "ブラック", "グリーン"],
      createdAt: daysAgo(70),
      updatedAt: daysAgo(5),
    },
    {
      name: "プリーツロングスカート",
      sku: "BTM-3002",
      category: "ボトムス",
      brand: "Camden Foot",
      price: 0,
      salePrice: null,
      stock: 12,
      status: "published",
      imageUrl: "",
      description: "価格未設定のまま公開されているサンプルデータ（価格ミスの例）。",
      sizes: ["M", "L"],
      colors: ["ブラック"],
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
    {
      name: "ダウンベスト",
      sku: "OUT-2002",
      category: "アウター",
      brand: "Nordwell",
      price: 12800,
      salePrice: null,
      stock: 0,
      status: "published",
      imageUrl: "",
      description: "軽量ダウンを使用したベスト。収納袋付きで持ち運びやすい。",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ネイビー", "カーキ"],
      createdAt: daysAgo(150),
      updatedAt: daysAgo(1),
    },
    {
      name: "スニーカー ローカット",
      sku: "SHO-4002",
      category: "シューズ",
      brand: "Camden Foot",
      price: 9800,
      salePrice: null,
      stock: 54,
      status: "published",
      imageUrl: "",
      description: "クッション性の高いソールを採用したローカットスニーカー。",
      sizes: ["24", "24.5", "25", "25.5", "26", "27"],
      colors: ["ホワイト", "グレー"],
      createdAt: daysAgo(100),
      updatedAt: daysAgo(20),
    },
    {
      name: "ミニショルダーバッグ",
      sku: "BAG-5002",
      category: "バッグ",
      brand: "Mira Studio",
      price: 8200,
      salePrice: null,
      stock: 6,
      status: "draft",
      imageUrl: "",
      description: "登録済みだが公開準備中のショルダーバッグ。撮影待ちのため未公開。",
      sizes: [],
      colors: ["キャメル"],
      createdAt: daysAgo(4),
      updatedAt: daysAgo(1),
    },
    {
      name: "定番デニムジャケット",
      sku: "OUT-2003",
      category: "アウター",
      brand: "Alto Blue",
      price: 13800,
      salePrice: null,
      stock: 0,
      status: "discontinued",
      imageUrl: "",
      description: "旧モデルのデニムジャケット。生産終了につき販売終了。",
      sizes: ["M", "L"],
      colors: ["インディゴ"],
      createdAt: daysAgo(400),
      updatedAt: daysAgo(90),
    },
    {
      name: "フープピアス",
      sku: "ACC-6002",
      category: "アクセサリー",
      brand: "Mira Studio",
      price: 3200,
      salePrice: null,
      stock: 40,
      status: "published",
      imageUrl: "",
      description: "軽量素材で長時間つけても負担になりにくいフープピアス。",
      sizes: [],
      colors: ["ゴールド", "シルバー"],
      createdAt: daysAgo(30),
      updatedAt: daysAgo(6),
    },
    {
      name: "ワイドチノパンツ",
      sku: "BTM-3003",
      category: "ボトムス",
      brand: "Nordwell",
      price: 7400,
      salePrice: null,
      stock: 2,
      status: "published",
      imageUrl: "",
      description: "ワイドシルエットのチノパンツ。テーパードで足元はすっきり。",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ベージュ", "オリーブ", "ブラック"],
      createdAt: daysAgo(80),
      updatedAt: daysAgo(8),
    },
  ];

  return base.map((item) => ({ id: crypto.randomUUID(), ...item }));
}

function readFromStorage(): Product[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProducts();
    const parsed = JSON.parse(raw) as Product[];
    return parsed.length > 0 ? parsed : seedProducts();
  } catch {
    return seedProducts();
  }
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function notify() {
  listeners.forEach((listener) => listener());
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  products = readFromStorage();
  persist();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Product[] {
  ensureHydrated();
  return products;
}

export function getServerSnapshot(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  ensureHydrated();
  return products.find((product) => product.id === id);
}

export function createProduct(input: ProductInput): Product {
  ensureHydrated();
  const now = new Date().toISOString();
  const product: Product = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  products = [product, ...products];
  persist();
  notify();
  return product;
}

export function updateProduct(id: string, input: ProductInput): Product | undefined {
  ensureHydrated();
  let updated: Product | undefined;
  products = products.map((product) => {
    if (product.id !== id) return product;
    updated = { ...product, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });
  persist();
  notify();
  return updated;
}
