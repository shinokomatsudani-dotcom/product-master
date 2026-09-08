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
import { CATEGORIES, PUBLISH_STATUS_LABEL, type ProductInput, type PublishStatus } from "@/lib/types";

const CATEGORY_SELECT_ITEMS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((category) => [category, category])
);

type ProductFormProps = {
  initialValue: ProductInput;
  submitLabel: string;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
};

type FormErrors = Partial<Record<"name" | "sku" | "category" | "price" | "stock", string>>;

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

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function ProductForm({ initialValue, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialValue.name);
  const [sku, setSku] = useState(initialValue.sku);
  const [category, setCategory] = useState(initialValue.category);
  const [brand, setBrand] = useState(initialValue.brand);
  const [price, setPrice] = useState(String(initialValue.price));
  const [salePrice, setSalePrice] = useState(
    initialValue.salePrice != null ? String(initialValue.salePrice) : ""
  );
  const [stock, setStock] = useState(String(initialValue.stock));
  const [status, setStatus] = useState<PublishStatus>(initialValue.status);
  const [imageUrl, setImageUrl] = useState(initialValue.imageUrl);
  const [description, setDescription] = useState(initialValue.description);
  const [sizesText, setSizesText] = useState(initialValue.sizes.join(", "));
  const [colorsText, setColorsText] = useState(initialValue.colors.join(", "));
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "商品名を入力してください";
    if (!sku.trim()) nextErrors.sku = "SKUを入力してください";
    if (!category) nextErrors.category = "カテゴリを選択してください";
    if (price === "" || Number(price) < 0) nextErrors.price = "0以上の価格を入力してください";
    if (stock === "" || Number(stock) < 0) nextErrors.stock = "0以上の在庫数を入力してください";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: name.trim(),
      sku: sku.trim(),
      category,
      brand: brand.trim(),
      price: Number(price),
      salePrice: salePrice === "" ? null : Number(salePrice),
      stock: Number(stock),
      status,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      sizes: sizesText
        .split(/[,、]/)
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colorsText
        .split(/[,、]/)
        .map((s) => s.trim())
        .filter(Boolean),
    });
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

      <FormSection title="基本情報">
        <FormField label="商品名" htmlFor="name" error={errors.name}>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="SKU" htmlFor="sku" error={errors.sku}>
          <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
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
        <FormField label="サイズ（任意・カンマ区切り）" htmlFor="sizes">
          <Input
            id="sizes"
            placeholder="例: S, M, L"
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
          />
        </FormField>
        <FormField label="カラー（任意・カンマ区切り）" htmlFor="colors">
          <Input
            id="colors"
            placeholder="例: ブラック, ホワイト"
            value={colorsText}
            onChange={(e) => setColorsText(e.target.value)}
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
