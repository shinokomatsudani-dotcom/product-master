import type { Product, ProductInput, Sku, SkuInput, SkuRow } from "@/lib/types";

const PRODUCTS_KEY = "product-master:v2:products";
const SKUS_KEY = "product-master:v2:skus";

type Listener = () => void;

type State = {
  products: Product[];
  skus: Sku[];
};

let state: State = { products: [], skus: [] };
let hydrated = false;
const listeners = new Set<Listener>();

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function seedState(): State {
  const products: Product[] = [];
  const skus: Sku[] = [];

  function addProduct(product: Omit<Product, "id">): string {
    const id = crypto.randomUUID();
    products.push({ id, ...product });
    return id;
  }

  function addSku(
    productId: string,
    sku: Omit<Sku, "id" | "productId" | "createdAt" | "updatedAt"> & {
      createdDaysAgo: number;
      updatedDaysAgo: number;
    }
  ) {
    const { createdDaysAgo, updatedDaysAgo, ...rest } = sku;
    skus.push({
      id: crypto.randomUUID(),
      productId,
      createdAt: daysAgo(createdDaysAgo),
      updatedAt: daysAgo(updatedDaysAgo),
      ...rest,
    });
  }

  // オーガニックコットンTシャツ — サイズ違いで在庫にばらつきあり
  const tshirt = addProduct({
    name: "オーガニックコットンTシャツ",
    category: "トップス",
    brand: "Nordwell",
    imageUrl: "",
    description:
      "厚手のオーガニックコットンを使用したベーシックTシャツ。洗濯による型崩れが少なく、通年で使いやすい一着です。",
  });
  [
    ["S", 12],
    ["M", 18],
    ["L", 8],
    ["XL", 4],
  ].forEach(([size, stock]) =>
    addSku(tshirt, {
      skuCode: `TOP-1001-${size}`,
      size: size as string,
      color: "ホワイト",
      price: 3900,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 120,
      updatedDaysAgo: 2,
    })
  );

  // ウールブレンドテーラードジャケット — Mだけ在庫切れ（Lはまだ在庫あり）
  const jacket = addProduct({
    name: "ウールブレンドテーラードジャケット",
    category: "アウター",
    brand: "Nordwell",
    imageUrl: "",
    description:
      "ウール混素材で軽さと保温性を両立したテーラードジャケット。オフィスカジュアルにも対応できるシルエット。",
  });
  addSku(jacket, {
    skuCode: "OUT-2001-M",
    size: "M",
    color: "チャコール",
    price: 24800,
    salePrice: 19800,
    stock: 0,
    status: "published",
    createdDaysAgo: 200,
    updatedDaysAgo: 1,
  });
  addSku(jacket, {
    skuCode: "OUT-2001-L",
    size: "L",
    color: "チャコール",
    price: 24800,
    salePrice: 19800,
    stock: 3,
    status: "published",
    createdDaysAgo: 200,
    updatedDaysAgo: 6,
  });

  // ストレッチスキニーデニム
  const denim = addProduct({
    name: "ストレッチスキニーデニム",
    category: "ボトムス",
    brand: "Alto Blue",
    imageUrl: "",
    description: "適度なストレッチ性を持たせたスキニーシルエットのデニムパンツ。",
  });
  [
    ["S", 5],
    ["M", 6],
    ["L", 4],
  ].forEach(([size, stock]) =>
    addSku(denim, {
      skuCode: `BTM-3001-${size}`,
      size: size as string,
      color: "インディゴ",
      price: 8900,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 180,
      updatedDaysAgo: 15,
    })
  );

  // レザーローファー — サイズごとに在庫僅少
  const loafer = addProduct({
    name: "レザーローファー",
    category: "シューズ",
    brand: "Camden Foot",
    imageUrl: "",
    description: "天然皮革を使用したローファー。履くほどに足に馴染むソフトな作り。",
  });
  [
    ["25", 1],
    ["25.5", 2],
    ["26", 0],
  ].forEach(([size, stock]) =>
    addSku(loafer, {
      skuCode: `SHO-4001-${size}`,
      size: size as string,
      color: "ブラウン",
      price: 15800,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 90,
      updatedDaysAgo: 30,
    })
  );

  // キャンバストートバッグ — サイズ無し、カラー違いのみ、非公開
  const tote = addProduct({
    name: "キャンバストートバッグ",
    category: "バッグ",
    brand: "Alto Blue",
    imageUrl: "",
    description: "厚手キャンバス生地のA4対応トートバッグ。内ポケット2つ付き。",
  });
  [
    ["ベージュ", 0],
    ["ブラック", 0],
  ].forEach(([color, stock]) =>
    addSku(tote, {
      skuCode: `BAG-5001-${color === "ベージュ" ? "BEG" : "BLK"}`,
      size: "",
      color: color as string,
      price: 5400,
      salePrice: null,
      stock: stock as number,
      status: "unpublished",
      createdDaysAgo: 60,
      updatedDaysAgo: 40,
    })
  );

  // シルバーチェーンネックレス — バリエーション無し
  const necklace = addProduct({
    name: "シルバーチェーンネックレス",
    category: "アクセサリー",
    brand: "Mira Studio",
    imageUrl: "",
    description: "925シルバー製のチェーンネックレス。長さ調整可能。",
  });
  addSku(necklace, {
    skuCode: "ACC-6001",
    size: "",
    color: "シルバー",
    price: 6200,
    salePrice: null,
    stock: 8,
    status: "published",
    createdDaysAgo: 45,
    updatedDaysAgo: 3,
  });

  // リブニットカーディガン
  const cardigan = addProduct({
    name: "リブニットカーディガン",
    category: "トップス",
    brand: "Mira Studio",
    imageUrl: "",
    description: "リブ編みのミドルゲージニットカーディガン。1枚でも羽織りとしても使える。",
  });
  [
    ["S", 5],
    ["M", 9],
    ["L", 7],
  ].forEach(([size, stock]) =>
    addSku(cardigan, {
      skuCode: `TOP-1002-${size}`,
      size: size as string,
      color: "オートミール",
      price: 7800,
      salePrice: 6200,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 70,
      updatedDaysAgo: 5,
    })
  );

  // フープピアス — カラー違いのみ
  const earrings = addProduct({
    name: "フープピアス",
    category: "アクセサリー",
    brand: "Mira Studio",
    imageUrl: "",
    description: "軽量素材で長時間つけても負担になりにくいフープピアス。",
  });
  [
    ["ゴールド", 22],
    ["シルバー", 18],
  ].forEach(([color, stock]) =>
    addSku(earrings, {
      skuCode: `ACC-6002-${color === "ゴールド" ? "GLD" : "SLV"}`,
      size: "",
      color: color as string,
      price: 3200,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 30,
      updatedDaysAgo: 6,
    })
  );

  // ワイドチノパンツ — ほぼ完売（Lのみ残り2）
  const chino = addProduct({
    name: "ワイドチノパンツ",
    category: "ボトムス",
    brand: "Nordwell",
    imageUrl: "",
    description: "ワイドシルエットのチノパンツ。テーパードで足元はすっきり。",
  });
  [
    ["S", 0],
    ["M", 0],
    ["L", 2],
    ["XL", 0],
  ].forEach(([size, stock]) =>
    addSku(chino, {
      skuCode: `BTM-3003-${size}`,
      size: size as string,
      color: "ベージュ",
      price: 7400,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 80,
      updatedDaysAgo: 8,
    })
  );

  // プリーツロングスカート — 価格未設定のまま公開（価格ミスの例）
  const skirt = addProduct({
    name: "プリーツロングスカート",
    category: "ボトムス",
    brand: "Camden Foot",
    imageUrl: "",
    description: "価格未設定のまま公開されているサンプルデータ（価格ミスの例）。",
  });
  [
    ["M", 6],
    ["L", 6],
  ].forEach(([size, stock]) =>
    addSku(skirt, {
      skuCode: `BTM-3002-${size}`,
      size: size as string,
      color: "ブラック",
      price: 0,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 10,
      updatedDaysAgo: 10,
    })
  );

  // ダウンベスト — 全サイズ在庫切れなのに公開中のまま（要注意の代表例）
  const vest = addProduct({
    name: "ダウンベスト",
    category: "アウター",
    brand: "Nordwell",
    imageUrl: "",
    description: "軽量ダウンを使用したベスト。収納袋付きで持ち運びやすい。",
  });
  ["S", "M", "L", "XL"].forEach((size) =>
    addSku(vest, {
      skuCode: `OUT-2002-${size}`,
      size,
      color: "ネイビー",
      price: 12800,
      salePrice: null,
      stock: 0,
      status: "published",
      createdDaysAgo: 150,
      updatedDaysAgo: 1,
    })
  );

  // スニーカー ローカット
  const sneaker = addProduct({
    name: "スニーカー ローカット",
    category: "シューズ",
    brand: "Camden Foot",
    imageUrl: "",
    description: "クッション性の高いソールを採用したローカットスニーカー。",
  });
  [
    ["25", 20],
    ["25.5", 15],
    ["26", 19],
  ].forEach(([size, stock]) =>
    addSku(sneaker, {
      skuCode: `SHO-4002-${size}`,
      size: size as string,
      color: "ホワイト",
      price: 9800,
      salePrice: null,
      stock: stock as number,
      status: "published",
      createdDaysAgo: 100,
      updatedDaysAgo: 20,
    })
  );

  // ミニショルダーバッグ — 準備中
  const shoulderBag = addProduct({
    name: "ミニショルダーバッグ",
    category: "バッグ",
    brand: "Mira Studio",
    imageUrl: "",
    description: "登録済みだが公開準備中のショルダーバッグ。撮影待ちのため未公開。",
  });
  addSku(shoulderBag, {
    skuCode: "BAG-5002",
    size: "",
    color: "キャメル",
    price: 8200,
    salePrice: null,
    stock: 6,
    status: "draft",
    createdDaysAgo: 4,
    updatedDaysAgo: 1,
  });

  // 定番デニムジャケット — 販売終了
  const denimJacket = addProduct({
    name: "定番デニムジャケット",
    category: "アウター",
    brand: "Alto Blue",
    imageUrl: "",
    description: "旧モデルのデニムジャケット。生産終了につき販売終了。",
  });
  ["M", "L"].forEach((size) =>
    addSku(denimJacket, {
      skuCode: `OUT-2003-${size}`,
      size,
      color: "インディゴ",
      price: 13800,
      salePrice: null,
      stock: 0,
      status: "discontinued",
      createdDaysAgo: 400,
      updatedDaysAgo: 90,
    })
  );

  return { products, skus };
}

function readFromStorage(): State {
  try {
    const rawProducts = window.localStorage.getItem(PRODUCTS_KEY);
    const rawSkus = window.localStorage.getItem(SKUS_KEY);
    if (!rawProducts || !rawSkus) return seedState();
    const products = JSON.parse(rawProducts) as Product[];
    const skus = JSON.parse(rawSkus) as Sku[];
    if (products.length === 0 && skus.length === 0) return seedState();
    return { products, skus };
  } catch {
    return seedState();
  }
}

function persist() {
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(state.products));
  window.localStorage.setItem(SKUS_KEY, JSON.stringify(state.skus));
}

function notify() {
  listeners.forEach((listener) => listener());
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readFromStorage();
  persist();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): State {
  ensureHydrated();
  return state;
}

export function getServerSnapshot(): State {
  return state;
}

export function toSkuRows(current: State): SkuRow[] {
  const productById = new Map(current.products.map((product) => [product.id, product]));
  const rows: SkuRow[] = [];
  for (const sku of current.skus) {
    const product = productById.get(sku.productId);
    if (product) rows.push({ ...sku, product });
  }
  return rows;
}

export function getSkuRow(id: string): SkuRow | undefined {
  ensureHydrated();
  return toSkuRows(state).find((row) => row.id === id);
}

export function getSiblingSkus(productId: string): Sku[] {
  ensureHydrated();
  return state.skus.filter((sku) => sku.productId === productId);
}

export function createProduct(productInput: ProductInput, skuInput: SkuInput): SkuRow {
  ensureHydrated();
  const now = new Date().toISOString();
  const product: Product = { id: crypto.randomUUID(), ...productInput };
  const sku: Sku = {
    id: crypto.randomUUID(),
    productId: product.id,
    ...skuInput,
    createdAt: now,
    updatedAt: now,
  };
  state = { products: [product, ...state.products], skus: [sku, ...state.skus] };
  persist();
  notify();
  return { ...sku, product };
}

export function updateSku(
  id: string,
  productInput: ProductInput,
  skuInput: SkuInput
): SkuRow | undefined {
  ensureHydrated();
  const existingSku = state.skus.find((sku) => sku.id === id);
  if (!existingSku) return undefined;

  const updatedProduct: Product = { id: existingSku.productId, ...productInput };
  const updatedSku: Sku = {
    ...existingSku,
    ...skuInput,
    updatedAt: new Date().toISOString(),
  };

  state = {
    products: state.products.map((product) =>
      product.id === existingSku.productId ? updatedProduct : product
    ),
    skus: state.skus.map((sku) => (sku.id === id ? updatedSku : sku)),
  };
  persist();
  notify();
  return { ...updatedSku, product: updatedProduct };
}
