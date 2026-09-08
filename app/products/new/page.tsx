"use client";

import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { useSkus } from "@/hooks/use-skus";
import { EMPTY_PRODUCT_INPUT, EMPTY_SKU_INPUT } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct } = useSkus();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
        <CaretLeft />
        戻る
      </Button>
      <h1 className="text-lg font-bold text-foreground">商品を新規登録</h1>

      <ProductForm
        initialProduct={EMPTY_PRODUCT_INPUT}
        initialSku={EMPTY_SKU_INPUT}
        submitLabel="登録する"
        onCancel={() => router.back()}
        onSubmit={(productInput, skuInput) => {
          const row = createProduct(productInput, skuInput);
          router.push(`/products/${row.id}`);
        }}
      />
    </div>
  );
}
