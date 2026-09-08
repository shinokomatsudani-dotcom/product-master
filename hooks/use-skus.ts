"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import * as productStore from "@/lib/product-store";
import { getDevFlags, subscribeDevFlags } from "@/lib/dev-flags";
import type { ProductInput, SkuInput } from "@/lib/types";

const INITIAL_LOAD_DELAY_MS = 500;

export function useSkus() {
  const state = useSyncExternalStore(
    productStore.subscribe,
    productStore.getSnapshot,
    productStore.getServerSnapshot
  );
  const devFlags = useSyncExternalStore(subscribeDevFlags, getDevFlags, getDevFlags);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), INITIAL_LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const rows = productStore.toSkuRows(state);
  const sorted = [...rows].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return {
    skuRows: sorted,
    isLoading: initialLoad || devFlags.forceLoading,
    isError: !initialLoad && devFlags.forceError,
    createProduct: (productInput: ProductInput, skuInput: SkuInput) =>
      productStore.createProduct(productInput, skuInput),
    updateSku: (id: string, productInput: ProductInput, skuInput: SkuInput) =>
      productStore.updateSku(id, productInput, skuInput),
    getSkuRow: productStore.getSkuRow,
    getSiblingSkus: productStore.getSiblingSkus,
  };
}
