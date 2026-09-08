export function formatPrice(value: number): string {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
