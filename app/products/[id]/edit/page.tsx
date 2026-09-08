"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CaretLeft, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { EmptyState } from "@/components/empty-state";
import { useProducts } from "@/hooks/use-products";
import type { ProductInput } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, getProduct, updateProduct } = useProducts();
  const product = getProduct(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!product) {
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

  const initialValue: ProductInput = {
    name: product.name,
    sku: product.sku,
    category: product.category,
    brand: product.brand,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    status: product.status,
    imageUrl: product.imageUrl,
    description: product.description,
    sizes: product.sizes,
    colors: product.colors,
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
        <CaretLeft />
        戻る
      </Button>
      <div>
        <h1 className="text-lg font-bold text-foreground">商品を編集</h1>
        <p className="text-sm text-muted-foreground">{product.sku}</p>
      </div>

      <ProductForm
        initialValue={initialValue}
        submitLabel="保存する"
        onCancel={() => router.back()}
        onSubmit={(input) => {
          updateProduct(product.id, input);
          router.push(`/products/${product.id}`);
        }}
      />
    </div>
  );
}
