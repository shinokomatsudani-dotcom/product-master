"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CaretLeft, PencilSimple, ImageSquare, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { useProducts } from "@/hooks/use-products";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{children}</div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, getProduct } = useProducts();
  const product = getProduct(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
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

  const priceMistake = product.price === 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <CaretLeft />
          一覧に戻る
        </Button>
        <Button nativeButton={false} render={<Link href={`/products/${product.id}/edit`} />}>
          <PencilSimple />
          編集する
        </Button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.sku}</p>
        </div>
        <StatusBadge status={product.status} />
      </div>

      <SectionCard title="販売情報">
        <Field label="在庫数">
          <span className={cn(product.stock === 0 && "font-medium text-destructive")}>
            {product.stock}
          </span>
        </Field>
        <Field label="公開状態">
          <StatusBadge status={product.status} />
        </Field>
        <Field label="価格">
          <span className={cn(priceMistake && "font-medium text-destructive")}>
            {priceMistake ? "未設定（0円）" : formatPrice(product.price)}
          </span>
        </Field>
        <Field label="セール価格">
          {product.salePrice != null ? formatPrice(product.salePrice) : "—"}
        </Field>
      </SectionCard>

      <SectionCard title="基本情報">
        <Field label="商品名">{product.name}</Field>
        <Field label="SKU">{product.sku}</Field>
        <Field label="カテゴリ">{product.category}</Field>
        <Field label="ブランド">{product.brand || "—"}</Field>
      </SectionCard>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">表示情報</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex size-28 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-full rounded-lg object-cover"
              />
            ) : (
              <ImageSquare size={28} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <Field label="説明文">
              {product.description || <span className="text-muted-foreground">未入力</span>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="サイズ">
                {product.sizes.length > 0 ? product.sizes.join(" / ") : "—"}
              </Field>
              <Field label="カラー">
                {product.colors.length > 0 ? product.colors.join(" / ") : "—"}
              </Field>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>登録日: {formatDate(product.createdAt)}</span>
        <span>更新日: {formatDate(product.updatedAt)}</span>
      </div>
    </div>
  );
}
