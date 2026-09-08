"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CATEGORIES, PUBLISH_STATUS_LABEL } from "@/lib/types";
import { hasActiveFilters, hasAdvancedFilters, type ProductFilters } from "@/lib/filter-products";
import { cn } from "@/lib/utils";

type ProductFiltersBarProps = {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
};

const CATEGORY_SELECT_ITEMS: Record<string, string> = {
  all: "すべてのカテゴリ",
  ...Object.fromEntries(CATEGORIES.map((category) => [category, category])),
};

const STATUS_SELECT_ITEMS: Record<string, string> = {
  all: "すべての状態",
  ...PUBLISH_STATUS_LABEL,
};

export function ProductFiltersBar({ filters, onChange, onReset }: ProductFiltersBarProps) {
  // 価格帯・更新日の条件が既にかかっている状態で一覧に戻ってきたときは、
  // パネルを畳んだままにすると「条件がかかっていること」が見えなくなるため自動的に開く。
  const [advancedOpen, setAdvancedOpen] = useState(() => hasAdvancedFilters(filters));
  const active = hasActiveFilters(filters);
  const advancedActive = hasAdvancedFilters(filters);

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="商品名・SKUで検索"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          className="w-full sm:w-56"
        />
        <Select
          items={CATEGORY_SELECT_ITEMS}
          value={filters.category}
          onValueChange={(value) => onChange({ category: value as string })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのカテゴリ</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={STATUS_SELECT_ITEMS}
          value={filters.status}
          onValueChange={(value) => onChange({ status: value as ProductFilters["status"] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="公開状態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての状態</SelectItem>
            {Object.entries(PUBLISH_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label className="flex shrink-0 items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
          <Switch
            size="sm"
            checked={filters.stockoutOnly}
            onCheckedChange={(checked) => onChange({ stockoutOnly: checked })}
          />
          <span className="text-sm">在庫切れのみ</span>
        </Label>

        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="ml-auto">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" size="sm">
                <SlidersHorizontal />
                詳細条件
                {advancedActive && !advancedOpen && (
                  <span
                    className="size-1.5 rounded-full bg-primary"
                    aria-label="詳細条件が設定されています"
                  />
                )}
              </Button>
            }
          />
        </Collapsible>

        {active && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X />
            条件をリセット
          </Button>
        )}
      </div>

      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleContent
          className={cn(
            "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-out",
            "data-closed:h-0"
          )}
        >
          <div className="grid grid-cols-1 gap-3 pt-2 pb-1 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">価格帯</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                placeholder="下限"
                value={filters.priceMin}
                onChange={(e) => onChange({ priceMin: e.target.value })}
              />
              <span className="text-muted-foreground">〜</span>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                placeholder="上限"
                value={filters.priceMax}
                onChange={(e) => onChange({ priceMax: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">更新日</Label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.updatedFrom}
                onChange={(e) => onChange({ updatedFrom: e.target.value })}
              />
              <span className="text-muted-foreground">〜</span>
              <Input
                type="date"
                value={filters.updatedTo}
                onChange={(e) => onChange({ updatedTo: e.target.value })}
              />
            </div>
          </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
