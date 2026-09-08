"use client";

import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { useProducts } from "@/hooks/use-products";
import { EMPTY_PRODUCT_INPUT } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct } = useProducts();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
        <CaretLeft />
        戻る
      </Button>
      <h1 className="text-lg font-bold text-foreground">商品を新規登録</h1>

      <ProductForm
        initialValue={EMPTY_PRODUCT_INPUT}
        submitLabel="登録する"
        onCancel={() => router.back()}
        onSubmit={(input) => {
          const product = createProduct(input);
          router.push(`/products/${product.id}`);
        }}
      />
    </div>
  );
}
