import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  /** color de marca para el ícono (token CSS) */
  accent?: string;
  trend?: number;
  hint?: string;
}

export function StatCard({ title, value, icon: Icon, accent = "var(--brand-blue)", trend, hint }: StatCardProps) {
  const showTrend = typeof trend === "number" && Number.isFinite(trend);
  const positive = (trend ?? 0) >= 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {showTrend ? (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                positive ? "text-success" : "text-danger",
              )}
            >
              {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {Math.abs(trend!).toFixed(1)}%
              <span className="font-normal text-muted-foreground">vs. mes anterior</span>
            </div>
          ) : (
            hint && <p className="text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
