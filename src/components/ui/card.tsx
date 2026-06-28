import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-border bg-card shadow-[0_20px_60px_rgba(28,25,23,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
