import { Card } from "@/components/ui/card";

export function AdminStatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 text-sm text-muted">{helper}</p>
    </Card>
  );
}
