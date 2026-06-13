"use client";

import { CalendarRange } from "lucide-react";
import { PRESETS_RANGO, type PresetRango } from "@/lib/rango-fechas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface RangoValue {
  preset: PresetRango;
  desde: string;
  hasta: string;
}

interface Props {
  value: RangoValue;
  onChange: (value: RangoValue) => void;
}

export function DateRangeFilter({ value, onChange }: Props) {
  const esPersonalizado = value.preset === "personalizado";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Periodo</Label>
        <Select
          value={value.preset}
          onValueChange={(v) => onChange({ ...value, preset: v as PresetRango })}
        >
          <SelectTrigger className="w-[180px]">
            <CalendarRange className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRESETS_RANGO.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {esPersonalizado && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Desde</Label>
            <Input
              type="date"
              value={value.desde}
              max={value.hasta || undefined}
              onChange={(e) => onChange({ ...value, desde: e.target.value })}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hasta</Label>
            <Input
              type="date"
              value={value.hasta}
              min={value.desde || undefined}
              onChange={(e) => onChange({ ...value, hasta: e.target.value })}
              className="w-[160px]"
            />
          </div>
        </>
      )}
    </div>
  );
}
