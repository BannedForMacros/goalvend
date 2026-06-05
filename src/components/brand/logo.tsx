import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

/** Marca GoalVend: ícono del logo + wordmark con degradado de marca. */
export function Logo({ size = 36, withText = true, className, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.jpeg"
        alt="GoalVend"
        width={size}
        height={size}
        priority
        className="rounded-lg object-contain"
      />
      {withText && (
        <span className={cn("text-xl font-extrabold tracking-tight", textClassName)}>
          <span className="text-[var(--brand-navy)] dark:text-white">Goal</span>
          <span className="bg-gradient-to-r from-[var(--brand-magenta)] to-[var(--brand-orange)] bg-clip-text text-transparent">
            Vend
          </span>
        </span>
      )}
    </div>
  );
}
