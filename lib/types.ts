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

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number | null;
  stock: number;
  status: PublishStatus;
  imageUrl: string;
  description: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const EMPTY_PRODUCT_INPUT: ProductInput = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  brand: "",
  price: 0,
  salePrice: null,
  stock: 0,
  status: "draft",
  imageUrl: "",
  description: "",
  sizes: [],
  colors: [],
};
