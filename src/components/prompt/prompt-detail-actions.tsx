"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromptDetailActions({
  promptId,
  initiallyFavorited = false,
}: {
  promptId: string;
  initiallyFavorited?: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [loading, setLoading] = useState(false);

  async function handleFavorite() {
    setLoading(true);

    try {
      const response = await fetch(`/api/prompts/${promptId}/favorite`, {
        method: favorited ? "DELETE" : "POST",
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("favorite failed");
      }

      setFavorited((current) => !current);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleFavorite} disabled={loading}>
      <Heart className="mr-2 size-4" />
      {loading ? "处理中..." : favorited ? "取消收藏" : "收藏 Prompt"}
    </Button>
  );
}
