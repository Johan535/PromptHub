import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
