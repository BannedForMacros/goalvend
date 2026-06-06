import ExcelJS from "exceljs";
import { formatMoneda } from "@/lib/format";
import type { ReporteDef } from "./data";

export async function buildExcel(def: ReporteDef): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "GoalVend";
  const ws = wb.addWorksheet("Reporte");

  // Título de marca
  const totalCols = def.columnas.length;
  ws.mergeCells(1, 1, 1, totalCols);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = `GoalVend · ${def.titulo}`;
  titleCell.font = { bold: true, size: 16, color: { argb: "FF001878" } };
  titleCell.alignment = { vertical: "middle" };
  ws.getRow(1).height = 26;

  // Cabecera
  const headerRow = ws.getRow(3);
  def.columnas.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF001878" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    ws.getColumn(i + 1).width = c.width ?? 18;
  });
  headerRow.height = 20;

  // Filas
  def.filas.forEach((fila) => {
    const row = ws.addRow(def.columnas.map((c) => fila[c.key]));
    def.columnas.forEach((c, i) => {
      if (c.money) {
        row.getCell(i + 1).numFmt = '"S/ "#,##0.00';
      }
    });
  });

  // Bordes ligeros en la tabla
  const lastRow = ws.lastRow?.number ?? 3;
  for (let r = 3; r <= lastRow; r++) {
    for (let cIdx = 1; cIdx <= totalCols; cIdx++) {
      ws.getCell(r, cIdx).border = {
        top: { style: "thin", color: { argb: "FFE2E6F3" } },
        bottom: { style: "thin", color: { argb: "FFE2E6F3" } },
        left: { style: "thin", color: { argb: "FFE2E6F3" } },
        right: { style: "thin", color: { argb: "FFE2E6F3" } },
      };
    }
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export { formatMoneda };
