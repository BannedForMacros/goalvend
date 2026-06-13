"use client";

import { Building2, Calendar, Package, ShoppingCart, Tag, User } from "lucide-react";
import type { VentaRow } from "@/modules/ventas/queries";
import { formatMoneda, formatFechaHora } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function Fila({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}

export function VentaDetalleDialog({
  venta,
  open,
  onOpenChange,
}: {
  venta: VentaRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-[var(--brand-blue)]" /> Detalle de la venta
          </DialogTitle>
          <DialogDescription>Información completa de la operación comercial.</DialogDescription>
        </DialogHeader>

        {venta && (
          <div className="divide-y">
            <Fila icon={Building2} label="Cliente">
              {venta.cliente}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({venta.clienteDocumento})
              </span>
            </Fila>
            <Fila icon={Package} label="Producto / servicio">
              <span className="flex items-center gap-2">
                {venta.producto}
                {venta.productoCategoria && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Tag className="size-3" /> {venta.productoCategoria}
                  </Badge>
                )}
              </span>
            </Fila>
            <Fila icon={User} label="Vendedor responsable">
              {venta.vendedor}
            </Fila>
            <Fila icon={Calendar} label="Fecha de operación">
              {formatFechaHora(venta.fecha)}
            </Fila>

            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">Cantidad</p>
                <p className="text-lg font-bold">{venta.cantidad}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">P. unitario</p>
                <p className="text-lg font-bold">{formatMoneda(venta.precioUnitario)}</p>
              </div>
              <div className="rounded-lg bg-[var(--brand-blue)]/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-[var(--brand-blue)]">
                  {formatMoneda(venta.total)}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
