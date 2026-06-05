import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Target,
  Gauge,
  Trophy,
  TrendingUp,
  FileText,
  Bell,
  Package,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { Rol } from "@/generated/prisma/enums";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Roles autorizados; si se omite, visible para todos. */
  roles?: Rol[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "General",
    items: [{ title: "Panel general", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operación comercial",
    items: [
      { title: "Clientes", href: "/clientes", icon: Users },
      { title: "Ventas", href: "/ventas", icon: ShoppingCart },
      { title: "Productos", href: "/productos", icon: Package },
      { title: "Metas", href: "/metas", icon: Target },
    ],
  },
  {
    label: "Inteligencia comercial",
    items: [
      { title: "Indicadores KPI", href: "/indicadores", icon: Gauge },
      { title: "Rendimiento", href: "/rendimiento", icon: Trophy },
      { title: "Proyección", href: "/proyeccion", icon: TrendingUp },
      { title: "Alertas", href: "/alertas", icon: Bell },
      { title: "Reportes", href: "/reportes", icon: FileText },
    ],
  },
  {
    label: "Administración",
    items: [
      { title: "Usuarios", href: "/usuarios", icon: UserCog, roles: ["ADMIN", "GERENTE"] },
    ],
  },
];

export const rolLabel: Record<Rol, string> = {
  ADMIN: "Administrador",
  GERENTE: "Gerente comercial",
  SUPERVISOR: "Supervisor de ventas",
  VENDEDOR: "Vendedor",
  MARKETING: "Marketing",
};
