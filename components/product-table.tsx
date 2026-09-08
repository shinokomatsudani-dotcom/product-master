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
import { variationLabel, type SkuRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductTable({ rows }: { rows: SkuRow[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商品名</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>バリエーション</TableHead>
          <TableHead className="text-right">在庫数</TableHead>
          <TableHead>公開状態</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const needsAttention = row.status === "published" && row.stock === 0;
          return (
            <TableRow
              key={row.id}
              onClick={() => router.push(`/products/${row.id}`)}
              className={cn("cursor-pointer", needsAttention && "bg-warning/10 hover:bg-warning/15")}
            >
              <TableCell className="font-medium text-foreground">{row.product.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.skuCode}</TableCell>
              <TableCell className="text-muted-foreground">{row.product.category}</TableCell>
              <TableCell className="text-muted-foreground">{variationLabel(row)}</TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums",
                  row.stock === 0 ? "font-medium text-destructive" : "text-foreground"
                )}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  {needsAttention && <Warning weight="fill" className="size-3.5" />}
                  {row.stock}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
