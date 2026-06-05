"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { navGroups } from "@/lib/nav";
import type { Rol } from "@/generated/prisma/enums";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

function useTitulo() {
  const pathname = usePathname();
  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return item.title;
      }
    }
  }
  return "GoalVend";
}

interface AppHeaderProps {
  nombre: string;
  email: string;
  rol: Rol;
  alertas?: number;
}

export function AppHeader({ nombre, email, rol, alertas = 0 }: AppHeaderProps) {
  const titulo = useTitulo();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <h1 className="text-base font-semibold sm:text-lg">{titulo}</h1>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild aria-label="Alertas">
          <Link href="/alertas" className="relative">
            <Bell className="size-5" />
            {alertas > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {alertas > 9 ? "9+" : alertas}
              </span>
            )}
          </Link>
        </Button>
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <UserMenu nombre={nombre} email={email} rol={rol} />
      </div>
    </header>
  );
}
