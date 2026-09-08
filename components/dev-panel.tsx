"use client";

import { useSyncExternalStore } from "react";
import { getDevFlags, setDevFlags, subscribeDevFlags } from "@/lib/dev-flags";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DevPanel() {
  const flags = useSyncExternalStore(subscribeDevFlags, getDevFlags, getDevFlags);

  return (
    <div className="fixed bottom-3 left-3 z-[100] flex items-center gap-1.5 rounded-full border border-border bg-popover px-2 py-1 text-xs text-muted-foreground shadow-md">
      <span className="px-1 font-medium">Dev</span>
      <Button
        size="xs"
        variant={flags.forceLoading ? "default" : "outline"}
        className={cn(flags.forceLoading && "text-primary-foreground")}
        onClick={() => setDevFlags({ forceLoading: !flags.forceLoading })}
      >
        ローディング
      </Button>
      <Button
        size="xs"
        variant={flags.forceError ? "destructive" : "outline"}
        onClick={() => setDevFlags({ forceError: !flags.forceError })}
      >
        エラー
      </Button>
    </div>
  );
}
