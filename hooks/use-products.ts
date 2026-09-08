"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import * as productStore from "@/lib/product-store";
import { getDevFlags, subscribeDevFlags } from "@/lib/dev-flags";

const INITIAL_LOAD_DELAY_MS = 500;

export function useProducts() {
  const products = useSyncExternalStore(
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

  const sorted = [...products].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return {
    products: sorted,
    isLoading: initialLoad || devFlags.forceLoading,
    isError: !initialLoad && devFlags.forceError,
    createProduct: productStore.createProduct,
    updateProduct: productStore.updateProduct,
    getProduct: productStore.getProduct,
  };
}
