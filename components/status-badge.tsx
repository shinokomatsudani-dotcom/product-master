import { Badge } from "@/components/ui/badge";
import { PUBLISH_STATUS_LABEL, type PublishStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<PublishStatus, string> = {
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  unpublished: "bg-muted text-muted-foreground",
  draft: "bg-warning/15 text-warning-foreground",
  discontinued: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", STATUS_CLASS[status])}>
      {PUBLISH_STATUS_LABEL[status]}
    </Badge>
  );
}
