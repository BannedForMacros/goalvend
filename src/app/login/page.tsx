import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TrendingUp, Target, BarChart3 } from "lucide-react";
import { auth } from "@/auth";
import { Logo } from "@/components/brand/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--brand-navy)] p-12 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, var(--brand-blue), transparent 45%), radial-gradient(circle at 80% 80%, var(--brand-magenta), transparent 40%), radial-gradient(circle at 70% 30%, var(--brand-purple), transparent 35%)",
          }}
        />
        <div className="relative z-10">
          <Logo size={44} textClassName="text-white text-2xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Convierte tus metas
            <br />
            en resultados.
          </h1>
          <p className="max-w-md text-white/80">
            Gestión comercial, seguimiento de metas de ventas y análisis del rendimiento
            empresarial mediante indicadores estratégicos en tiempo real.
          </p>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-center gap-3">
              <Target className="size-5 text-[var(--brand-cyan)]" /> Metas individuales y grupales
            </li>
            <li className="flex items-center gap-3">
              <BarChart3 className="size-5 text-[var(--brand-green)]" /> Indicadores KPI con semáforo
            </li>
            <li className="flex items-center gap-3">
              <TrendingUp className="size-5 text-[var(--brand-orange)]" /> Proyección y ranking comercial
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} GoalVend · Giuliana, Roberto &amp; César
        </p>
      </div>

      {/* Panel de formulario */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60 shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center lg:hidden">
              <Logo size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bienvenido de nuevo</h2>
              <p className="text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder al panel.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-6 rounded-md bg-muted/60 px-3 py-2 text-center text-xs text-muted-foreground">
              Demo: <strong>admin@goalvend.pe</strong> / <strong>admin123</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
