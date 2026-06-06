import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMoneda, formatFechaHora } from "@/lib/format";
import type { ReporteDef } from "./data";

export function buildPdf(def: ReporteDef): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Encabezado de marca
  doc.setFillColor(0, 24, 120); // navy
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("GoalVend", 14, 14);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(def.titulo, 45, 14);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text(`Generado: ${formatFechaHora(new Date())}`, 14, 28);

  const head = [def.columnas.map((c) => c.header)];
  const body = def.filas.map((fila) =>
    def.columnas.map((c) => {
      const value = fila[c.key];
      if (c.money) return formatMoneda(value);
      return String(value ?? "");
    }),
  );

  autoTable(doc, {
    head,
    body,
    startY: 32,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 24, 120], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [243, 245, 251] },
    margin: { left: 14, right: 14 },
  });

  return Buffer.from(doc.output("arraybuffer"));
}
