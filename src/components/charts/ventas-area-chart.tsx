"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoneda } from "@/lib/format";

export function VentasAreaChart({ data }: { data: { mes: string; ventas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} className="text-xs" />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs"
          width={70}
          tickFormatter={(v) => `S/ ${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v) => [formatMoneda(Number(v)), "Ventas"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 13,
          }}
        />
        <Area
          type="monotone"
          dataKey="ventas"
          stroke="var(--brand-blue)"
          strokeWidth={2.5}
          fill="url(#fillVentas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
