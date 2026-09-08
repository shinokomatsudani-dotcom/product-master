export type PublishStatus = "published" | "unpublished" | "draft" | "discontinued";

export const PUBLISH_STATUS_LABEL: Record<PublishStatus, string> = {
  published: "公開中",
  unpublished: "非公開",
  draft: "準備中",
  discontinued: "販売終了",
};

export const CATEGORIES = [
  "トップス",
  "ボトムス",
  "アウター",
  "シューズ",
  "バッグ",
  "アクセサリー",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * 商品（型番）。サイズ・カラー違いで共有される情報のみを持つ。
 * 在庫・価格・公開状態はSKU側で管理する。
 */
export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  imageUrl: string;
  description: string;
};

export type ProductInput = Omit<Product, "id">;

export const EMPTY_PRODUCT_INPUT: ProductInput = {
  name: "",
  category: CATEGORIES[0],
  brand: "",
  imageUrl: "",
  description: "",
};

/**
 * SKU。実際に在庫・販売を管理する最小単位（サイズ・カラーごとに1レコード）。
 */
export type Sku = {
  id: string;
  productId: string;
  skuCode: string;
  size: string;
  color: string;
  price: number;
  salePrice: number | null;
  stock: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
};

export type SkuInput = Omit<Sku, "id" | "productId" | "createdAt" | "updatedAt">;

export const EMPTY_SKU_INPUT: SkuInput = {
  skuCode: "",
  size: "",
  color: "",
  price: 0,
  salePrice: null,
  stock: 0,
  status: "draft",
};

/** 一覧・詳細画面で使う、SKUとその親商品情報を合わせたビュー */
export type SkuRow = Sku & {
  product: Product;
};

export function variationLabel(sku: Pick<Sku, "size" | "color">): string {
  const parts = [sku.size, sku.color].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "—";
}
