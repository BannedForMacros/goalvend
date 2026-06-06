"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoneda } from "@/lib/format";

interface Punto {
  mes: string;
  ventas: number;
  proyeccion?: number;
}

export function ProyeccionChart({ data }: { data: Punto[] }) {
  // Combina valor real y proyección en una sola barra por mes.
  const chartData = data.map((d) => ({
    mes: d.mes,
    valor: d.proyeccion ?? d.ventas,
    esProyeccion: d.proyeccion != null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} className="text-xs" />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs"
          width={70}
          tickFormatter={(v) => `S/ ${(Number(v) / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          formatter={(v, _n, item) => [
            formatMoneda(Number(v)),
            (item?.payload as { esProyeccion?: boolean })?.esProyeccion ? "Proyección" : "Ventas",
          ]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={42}>
          {chartData.map((d, i) => (
            <Cell
              key={i}
              fill={d.esProyeccion ? "var(--brand-magenta)" : "var(--brand-blue)"}
              fillOpacity={d.esProyeccion ? 0.85 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
