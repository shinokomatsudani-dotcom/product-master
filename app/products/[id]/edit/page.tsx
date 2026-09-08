"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CaretLeft, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { EmptyState } from "@/components/empty-state";
import { useSkus } from "@/hooks/use-skus";
import type { ProductInput, SkuInput } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, getSkuRow, getSiblingSkus, updateSku } = useSkus();
  const row = getSkuRow(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4 sm:p-6">
        <EmptyState
          icon={<Warning size={24} />}
          title="商品が見つかりません"
          description="削除されたか、URLが正しくない可能性があります"
          action={
            <Button variant="outline" nativeButton={false} render={<Link href="/products" />}>
              一覧に戻る
            </Button>
          }
        />
      </div>
    );
  }

  const siblingCount = getSiblingSkus(row.product.id).length - 1;

  const initialProduct: ProductInput = {
    name: row.product.name,
    category: row.product.category,
    brand: row.product.brand,
    imageUrl: row.product.imageUrl,
    description: row.product.description,
  };

  const initialSku: SkuInput = {
    skuCode: row.skuCode,
    size: row.size,
    color: row.color,
    price: row.price,
    salePrice: row.salePrice,
    stock: row.stock,
    status: row.status,
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
        <CaretLeft />
        戻る
      </Button>
      <div>
        <h1 className="text-lg font-bold text-foreground">商品を編集</h1>
        <p className="text-sm text-muted-foreground">{row.skuCode}</p>
      </div>

      <ProductForm
        initialProduct={initialProduct}
        initialSku={initialSku}
        submitLabel="保存する"
        sharedNote={
          siblingCount > 0
            ? `この商品の他の${siblingCount}件のバリエーションにも反映されます`
            : undefined
        }
        onCancel={() => router.back()}
        onSubmit={(productInput, skuInput) => {
          updateSku(row.id, productInput, skuInput);
          router.push(`/products/${row.id}`);
        }}
      />
    </div>
  );
}
