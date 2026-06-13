"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { DateRangeFilter, type RangoValue } from "@/components/ui/date-range-filter";
import type { PresetRango } from "@/lib/rango-fechas";

export function VentasFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const value: RangoValue = {
    preset: (params.get("preset") as PresetRango) ?? "mes",
    desde: params.get("desde") ?? "",
    hasta: params.get("hasta") ?? "",
  };

  function onChange(next: RangoValue) {
    const sp = new URLSearchParams();
    sp.set("preset", next.preset);
    if (next.preset === "personalizado") {
      if (next.desde) sp.set("desde", next.desde);
      if (next.hasta) sp.set("hasta", next.hasta);
    }
    startTransition(() => {
      router.push(`/ventas?${sp.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <DateRangeFilter value={value} onChange={onChange} />
      {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
