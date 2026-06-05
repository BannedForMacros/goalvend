"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoneda } from "@/lib/format";

const COLORS = [
  "var(--brand-blue)",
  "var(--brand-cyan)",
  "var(--brand-green)",
  "var(--brand-orange)",
  "var(--brand-magenta)",
];

export function RankingBarChart({ data }: { data: { nombre: string; total: number }[] }) {
  if (data.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Sin datos del periodo.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="nombre"
          tickLine={false}
          axisLine={false}
          width={110}
          className="text-xs"
          tickFormatter={(v: string) => v.split(" ")[0]}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          formatter={(v) => [formatMoneda(Number(v)), "Ventas"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
