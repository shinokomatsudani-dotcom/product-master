import type { Product, PublishStatus } from "@/lib/types";

export type ProductFilters = {
  q: string;
  category: string;
  status: PublishStatus | "all";
  stockoutOnly: boolean;
  priceMin: string;
  priceMax: string;
  updatedFrom: string;
  updatedTo: string;
};

export const DEFAULT_FILTERS: ProductFilters = {
  q: "",
  category: "all",
  status: "all",
  stockoutOnly: false,
  priceMin: "",
  priceMax: "",
  updatedFrom: "",
  updatedTo: "",
};

export function hasAdvancedFilters(filters: ProductFilters): boolean {
  return (
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.updatedFrom !== "" ||
    filters.updatedTo !== ""
  );
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.stockoutOnly ||
    hasAdvancedFilters(filters)
  );
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const keyword = filters.q.trim().toLowerCase();
  const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : null;
  const updatedFrom = filters.updatedFrom ? new Date(filters.updatedFrom).getTime() : null;
  const updatedTo = filters.updatedTo ? new Date(filters.updatedTo).getTime() : null;

  return products.filter((product) => {
    if (keyword) {
      const haystack = `${product.name} ${product.sku}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (filters.category !== "all" && product.category !== filters.category) return false;
    if (filters.status !== "all" && product.status !== filters.status) return false;
    if (filters.stockoutOnly && product.stock > 0) return false;
    if (priceMin !== null && product.price < priceMin) return false;
    if (priceMax !== null && product.price > priceMax) return false;
    if (updatedFrom !== null && new Date(product.updatedAt).getTime() < updatedFrom) return false;
    if (updatedTo !== null && new Date(product.updatedAt).getTime() > updatedTo) return false;
    return true;
  });
}
