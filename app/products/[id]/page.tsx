"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CaretLeft, PencilSimple, ImageSquare, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { useSkus } from "@/hooks/use-skus";
import { formatDate, formatPrice } from "@/lib/format";
import { variationLabel } from "@/lib/types";
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
  const { isLoading, getSkuRow, getSiblingSkus } = useSkus();
  const row = getSkuRow(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
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

  const priceMistake = row.price === 0;
  const siblings = getSiblingSkus(row.product.id).sort((a, b) =>
    variationLabel(a).localeCompare(variationLabel(b), "ja")
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <CaretLeft />
          一覧に戻る
        </Button>
        <Button nativeButton={false} render={<Link href={`/products/${row.id}/edit`} />}>
          <PencilSimple />
          編集する
        </Button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">{row.product.name}</h1>
          <p className="text-sm text-muted-foreground">{row.skuCode}</p>
        </div>
        <StatusBadge status={row.status} />
      </div>

      <SectionCard title="販売情報">
        <Field label="在庫数">
          <span className={cn(row.stock === 0 && "font-medium text-destructive")}>
            {row.stock}
          </span>
        </Field>
        <Field label="公開状態">
          <StatusBadge status={row.status} />
        </Field>
        <Field label="価格">
          <span className={cn(priceMistake && "font-medium text-destructive")}>
            {priceMistake ? "未設定（0円）" : formatPrice(row.price)}
          </span>
        </Field>
        <Field label="セール価格">
          {row.salePrice != null ? formatPrice(row.salePrice) : "—"}
        </Field>
      </SectionCard>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">バリエーション</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="SKU">{row.skuCode}</Field>
          <Field label="サイズ">{row.size || "—"}</Field>
          <Field label="カラー">{row.color || "—"}</Field>
        </div>
        {siblings.length > 1 && (
          <>
            <p className="mt-4 mb-2 text-xs text-muted-foreground">
              この商品の他のバリエーション（同一商品名で共有）
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>バリエーション</TableHead>
                  <TableHead className="text-right">在庫数</TableHead>
                  <TableHead>公開状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {siblings.map((sibling) => {
                  const isCurrent = sibling.id === row.id;
                  return (
                    <TableRow
                      key={sibling.id}
                      className={cn(!isCurrent && "cursor-pointer", isCurrent && "bg-accent/60")}
                      onClick={() => !isCurrent && router.push(`/products/${sibling.id}`)}
                    >
                      <TableCell className={cn(isCurrent && "font-medium text-foreground")}>
                        {sibling.skuCode}
                        {isCurrent && <span className="ml-1.5 text-xs text-muted-foreground">（表示中）</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{variationLabel(sibling)}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          sibling.stock === 0 ? "font-medium text-destructive" : "text-foreground"
                        )}
                      >
                        {sibling.stock}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={sibling.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      <SectionCard title="基本情報">
        <Field label="商品名">{row.product.name}</Field>
        <Field label="カテゴリ">{row.product.category}</Field>
        <Field label="ブランド">{row.product.brand || "—"}</Field>
      </SectionCard>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">表示情報</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex size-28 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {row.product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.product.imageUrl}
                alt={row.product.name}
                className="size-full rounded-lg object-cover"
              />
            ) : (
              <ImageSquare size={28} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <Field label="説明文">
              {row.product.description || <span className="text-muted-foreground">未入力</span>}
            </Field>
          </div>
        </div>
      </div>

      <Separator />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>登録日: {formatDate(row.createdAt)}</span>
        <span>更新日: {formatDate(row.updatedAt)}</span>
      </div>
    </div>
  );
}
