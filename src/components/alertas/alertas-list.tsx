"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Check,
  CheckCheck,
  Info,
  OctagonAlert,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { marcarLeida, marcarTodasLeidas, eliminarAlerta } from "@/modules/alertas/actions";
import type { AlertaRow } from "@/modules/alertas/queries";
import { formatFechaHora } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NIVEL: Record<AlertaRow["nivel"], { icon: LucideIcon; color: string; label: string }> = {
  INFO: { icon: Info, color: "var(--brand-blue)", label: "Información" },
  ADVERTENCIA: { icon: TriangleAlert, color: "var(--brand-orange)", label: "Advertencia" },
  CRITICO: { icon: OctagonAlert, color: "var(--brand-magenta)", label: "Crítico" },
};

export function AlertasList({ alertas }: { alertas: AlertaRow[] }) {
  const [pending, startTransition] = useTransition();

  function leer(id: string) {
    startTransition(async () => {
      const res = await marcarLeida(id);
      if (!res.ok) toast.error(res.error ?? "Error");
    });
  }
  function leerTodas() {
    startTransition(async () => {
      await marcarTodasLeidas();
      toast.success("Todas las alertas marcadas como leídas");
    });
  }
  function borrar(id: string) {
    startTransition(async () => {
      const res = await eliminarAlerta(id);
      if (res.ok) toast.success("Alerta eliminada");
      else toast.error(res.error ?? "Error");
    });
  }

  if (alertas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
          <CheckCheck className="size-10 text-success" />
          <p className="font-medium">Sin alertas pendientes</p>
          <p className="text-sm text-muted-foreground">
            El rendimiento comercial está dentro de lo esperado.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hayNoLeidas = alertas.some((a) => !a.leida);

  return (
    <div className="space-y-3">
      {hayNoLeidas && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={leerTodas} disabled={pending}>
            <CheckCheck className="size-4" /> Marcar todas como leídas
          </Button>
        </div>
      )}

      {alertas.map((a) => {
        const nivel = NIVEL[a.nivel];
        const Icon = nivel.icon;
        return (
          <Card key={a.id} className={cn("transition-colors", !a.leida && "border-l-4")}
            style={!a.leida ? { borderLeftColor: nivel.color } : undefined}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `color-mix(in srgb, ${nivel.color} 14%, transparent)`,
                  color: nivel.color,
                }}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.titulo}</h3>
                  {!a.leida && (
                    <span className="size-2 rounded-full" style={{ backgroundColor: nivel.color }} />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.mensaje}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {a.vendedor && <span>Vendedor: {a.vendedor}</span>}
                  {a.meta && <span>Meta: {a.meta}</span>}
                  <span>{formatFechaHora(a.creadoEn)}</span>
                </div>
              </div>

              <div className="flex shrink-0 gap-1">
                {!a.leida && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    title="Marcar como leída"
                    onClick={() => leer(a.id)}
                    disabled={pending}
                  >
                    <Check className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-danger hover:text-danger"
                  title="Eliminar"
                  onClick={() => borrar(a.id)}
                  disabled={pending}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
