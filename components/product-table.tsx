"use client";

import { useRouter } from "next/navigation";
import { Warning } from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商品名</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead className="text-right">在庫数</TableHead>
          <TableHead>公開状態</TableHead>
          <TableHead>更新日</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const needsAttention = product.status === "published" && product.stock === 0;
          return (
            <TableRow
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className={cn("cursor-pointer", needsAttention && "bg-warning/10 hover:bg-warning/15")}
            >
              <TableCell className="font-medium text-foreground">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.sku}</TableCell>
              <TableCell className="text-muted-foreground">{product.category}</TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums",
                  product.stock === 0 ? "font-medium text-destructive" : "text-foreground"
                )}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  {needsAttention && <Warning weight="fill" className="size-3.5" />}
                  {product.stock}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(product.updatedAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
