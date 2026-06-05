"use client";

import { infoEstado } from "@/lib/kpi";

export function CumplimientoGauge({ pct }: { pct: number }) {
  const info = infoEstado(pct);
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative size-44">
        <svg className="size-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--muted)" strokeWidth="14" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={info.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: info.color }}>
            {pct.toFixed(0)}%
          </span>
          <span className="text-xs text-muted-foreground">cumplimiento</span>
        </div>
      </div>
      <div
        className="rounded-full border px-3 py-1 text-sm font-medium"
        style={{
          color: info.color,
          borderColor: `color-mix(in srgb, ${info.color} 35%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${info.color} 12%, transparent)`,
        }}
      >
        {info.emoji} {info.label}
      </div>
    </div>
  );
}
