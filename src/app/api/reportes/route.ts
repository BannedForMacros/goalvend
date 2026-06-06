import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { buildReporte, type ReporteTipo } from "@/modules/reportes/data";
import { buildExcel } from "@/modules/reportes/excel";
import { buildPdf } from "@/modules/reportes/pdf";

export const runtime = "nodejs";

const TIPOS: ReporteTipo[] = ["ventas", "metas", "rendimiento", "clientes"];

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("reporte") as ReporteTipo | null;
  const formato = searchParams.get("formato");

  if (!tipo || !TIPOS.includes(tipo)) {
    return NextResponse.json({ error: "Reporte inválido" }, { status: 400 });
  }

  const def = await buildReporte(tipo);
  const fechaSlug = new Date().toISOString().slice(0, 10);

  if (formato === "excel") {
    const buffer = await buildExcel(def);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="goalvend-${tipo}-${fechaSlug}.xlsx"`,
      },
    });
  }

  if (formato === "pdf") {
    const buffer = buildPdf(def);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="goalvend-${tipo}-${fechaSlug}.pdf"`,
      },
    });
  }

  return NextResponse.json({ error: "Formato inválido (usa excel o pdf)" }, { status: 400 });
}
