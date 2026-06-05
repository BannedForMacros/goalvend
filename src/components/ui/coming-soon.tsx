import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({ modulo, detalle }: { modulo: string; detalle?: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]">
          <Construction className="size-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Módulo {modulo}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {detalle ?? "Este módulo está en construcción y estará disponible muy pronto."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
