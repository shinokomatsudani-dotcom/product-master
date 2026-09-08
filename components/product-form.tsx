"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  PUBLISH_STATUS_LABEL,
  type ProductInput,
  type PublishStatus,
  type SkuInput,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_SELECT_ITEMS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((category) => [category, category])
);

type ProductFormProps = {
  initialProduct: ProductInput;
  initialSku: SkuInput;
  submitLabel: string;
  /** 既存商品の他バリエーション編集時、基本情報が共有される旨の注記を出す */
  sharedNote?: string;
  onSubmit: (productInput: ProductInput, skuInput: SkuInput) => void;
  onCancel: () => void;
};

type FormErrors = Partial<Record<"name" | "skuCode" | "category" | "price" | "stock", string>>;

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FormSection({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-1 text-sm font-semibold text-foreground">{title}</h2>
      {note && <p className="mb-3 text-xs text-muted-foreground">{note}</p>}
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", !note && "mt-3")}>{children}</div>
    </div>
  );
}

export function ProductForm({
  initialProduct,
  initialSku,
  submitLabel,
  sharedNote,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialProduct.name);
  const [category, setCategory] = useState(initialProduct.category);
  const [brand, setBrand] = useState(initialProduct.brand);
  const [imageUrl, setImageUrl] = useState(initialProduct.imageUrl);
  const [description, setDescription] = useState(initialProduct.description);

  const [skuCode, setSkuCode] = useState(initialSku.skuCode);
  const [size, setSize] = useState(initialSku.size);
  const [color, setColor] = useState(initialSku.color);
  const [price, setPrice] = useState(String(initialSku.price));
  const [salePrice, setSalePrice] = useState(
    initialSku.salePrice != null ? String(initialSku.salePrice) : ""
  );
  const [stock, setStock] = useState(String(initialSku.stock));
  const [status, setStatus] = useState<PublishStatus>(initialSku.status);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "商品名を入力してください";
    if (!skuCode.trim()) nextErrors.skuCode = "SKUを入力してください";
    if (!category) nextErrors.category = "カテゴリを選択してください";
    if (price === "" || Number(price) < 0) nextErrors.price = "0以上の価格を入力してください";
    if (stock === "" || Number(stock) < 0) nextErrors.stock = "0以上の在庫数を入力してください";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(
      {
        name: name.trim(),
        category,
        brand: brand.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
      },
      {
        skuCode: skuCode.trim(),
        size: size.trim(),
        color: color.trim(),
        price: Number(price),
        salePrice: salePrice === "" ? null : Number(salePrice),
        stock: Number(stock),
        status,
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormSection title="販売情報">
        <FormField label="在庫数" htmlFor="stock" error={errors.stock}>
          <Input
            id="stock"
            type="number"
            inputMode="numeric"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </FormField>
        <FormField label="公開状態" htmlFor="status">
          <Select
            items={PUBLISH_STATUS_LABEL}
            value={status}
            onValueChange={(value) => setStatus(value as PublishStatus)}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PUBLISH_STATUS_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="価格" htmlFor="price" error={errors.price}>
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormField>
        <FormField label="セール価格（任意）" htmlFor="salePrice">
          <Input
            id="salePrice"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="未設定"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="バリエーション"
        note="このSKU固有の識別情報です（サイズ・カラー違いごとに1レコード）"
      >
        <FormField label="SKU" htmlFor="skuCode" error={errors.skuCode}>
          <Input id="skuCode" value={skuCode} onChange={(e) => setSkuCode(e.target.value)} />
        </FormField>
        <FormField label="サイズ（任意）" htmlFor="size">
          <Input id="size" placeholder="例: M" value={size} onChange={(e) => setSize(e.target.value)} />
        </FormField>
        <FormField label="カラー（任意）" htmlFor="color">
          <Input
            id="color"
            placeholder="例: ブラック"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="基本情報"
        note={sharedNote ?? "同じ商品名を持つ全バリエーションで共有される情報です"}
      >
        <FormField label="商品名" htmlFor="name" error={errors.name}>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="カテゴリ" htmlFor="category" error={errors.category}>
          <Select
            items={CATEGORY_SELECT_ITEMS}
            value={category}
            onValueChange={(value) => setCategory(value as string)}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="ブランド（任意）" htmlFor="brand">
          <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </FormField>
      </FormSection>

      <FormSection title="表示情報">
        <FormField label="画像URL（任意）" htmlFor="imageUrl">
          <Input
            id="imageUrl"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="説明文（任意）" htmlFor="description">
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
        </div>
      </FormSection>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
