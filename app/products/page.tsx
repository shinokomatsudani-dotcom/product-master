"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Package, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductFiltersBar } from "@/components/product-filters";
import { ProductTable } from "@/components/product-table";
import { ProductTableSkeleton } from "@/components/product-table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useProducts } from "@/hooks/use-products";
import {
  DEFAULT_FILTERS,
  filterProducts,
  type ProductFilters,
} from "@/lib/filter-products";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading, isError } = useProducts();

  const filters: ProductFilters = useMemo(
    () => ({
      q: searchParams.get("q") ?? DEFAULT_FILTERS.q,
      category: searchParams.get("category") ?? DEFAULT_FILTERS.category,
      status: (searchParams.get("status") as ProductFilters["status"]) ?? DEFAULT_FILTERS.status,
      stockoutOnly: searchParams.get("stockout") === "1",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
      updatedFrom: searchParams.get("updatedFrom") ?? "",
      updatedTo: searchParams.get("updatedTo") ?? "",
    }),
    [searchParams]
  );

  const updateFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      const next = { ...filters, ...patch };
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.category !== "all") params.set("category", next.category);
      if (next.status !== "all") params.set("status", next.status);
      if (next.stockoutOnly) params.set("stockout", "1");
      if (next.priceMin) params.set("priceMin", next.priceMin);
      if (next.priceMax) params.set("priceMax", next.priceMax);
      if (next.updatedFrom) params.set("updatedFrom", next.updatedFrom);
      if (next.updatedTo) params.set("updatedTo", next.updatedTo);
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [filters, router]
  );

  const resetFilters = useCallback(() => {
    router.replace("/products", { scroll: false });
  }, [router]);

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">商品マスタ</h1>
          <p className="text-sm text-muted-foreground">
            在庫状況と公開状態をひと目で確認できます
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/products/new" />}>
          <Plus weight="bold" />
          新規登録
        </Button>
      </div>

      <ProductFiltersBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
        {isError ? (
          <EmptyState
            icon={<WarningCircle size={24} />}
            title="商品データの取得に失敗しました"
            description="時間をおいて再度お試しください"
            action={
              <Button variant="outline" onClick={() => window.location.reload()}>
                再読み込み
              </Button>
            }
          />
        ) : isLoading ? (
          <ProductTableSkeleton />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package size={24} />}
            title="商品がまだ登録されていません"
            description="右上の「新規登録」から商品を追加してください"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass size={24} />}
            title="条件に一致する商品がありません"
            description="キーワードや絞り込み条件を見直してください"
            action={
              <Button variant="outline" onClick={resetFilters}>
                条件をリセット
              </Button>
            }
          />
        ) : (
          <>
            <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
              {filtered.length}件 / 全{products.length}件
            </div>
            <ProductTable products={filtered} />
          </>
        )}
      </div>
    </div>
  );
}
