import Link from "next/link";
import { ArrowUpRight, Heart, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";
import { PromptItem } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptItem }) {
  return (
    <Card className="group h-full p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <Badge>{prompt.category.name}</Badge>
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            {prompt.visibility}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-8 tracking-tight">
            {prompt.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-7 text-muted">
            {prompt.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Heart className="size-4" />
              {formatCompactNumber(prompt.favoriteCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers3 className="size-4" />
              {prompt.toolSupport.length} tools
            </span>
          </div>
          <Link
            href={`/prompts/${prompt.id}`}
            className="inline-flex items-center gap-1 font-medium text-foreground"
          >
            查看详情
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
