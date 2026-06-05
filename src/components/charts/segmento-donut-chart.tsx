"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatMoneda } from "@/lib/format";

const COLORS = [
  "var(--brand-blue)",
  "var(--brand-cyan)",
  "var(--brand-green)",
  "var(--brand-orange)",
  "var(--brand-magenta)",
  "var(--brand-purple)",
];

const LABELS: Record<string, string> = {
  CORPORATIVO: "Corporativo",
  PYME: "Pyme",
  MINORISTA: "Minorista",
  EMPRENDEDOR: "Emprendedor",
  NUEVO: "Nuevo",
};

export function SegmentoDonutChart({ data }: { data: { segmento: string; total: number }[] }) {
  if (data.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Sin datos del periodo.</p>;
  }
  const chartData = data.map((d) => ({ name: LABELS[d.segmento] ?? d.segmento, value: d.total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
          stroke="var(--background)"
          strokeWidth={2}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => formatMoneda(Number(v))}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 13,
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
