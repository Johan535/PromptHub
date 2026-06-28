"use client";

import { useMemo, useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PromptItem } from "@/types/prompt";

function replaceVariables(template: string, values: Record<string, string>) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, rawKey: string) => {
    const key = rawKey.trim();
    return values[key] ?? "";
  });
}

export function PromptRenderer({ prompt }: { prompt: PromptItem }) {
  const defaultValues = useMemo(
    () =>
      prompt.variables.reduce<Record<string, string>>((acc, variable) => {
        acc[variable.varKey] = variable.defaultValue ?? "";
        return acc;
      }, {}),
    [prompt.variables],
  );
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [copied, setCopied] = useState(false);

  const renderedPrompt = useMemo(
    () => replaceVariables(prompt.content, values),
    [prompt.content, values],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(renderedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1.15fr]">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">变量填写</p>
            <p className="text-sm text-muted">
              先补齐上下文，再生成最终 Prompt。
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
            {prompt.variables.length} 个变量
          </span>
        </div>

        <div className="space-y-4">
          {prompt.variables
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((variable) => (
              <label key={variable.id} className="block space-y-2">
                <span className="text-sm font-medium text-foreground">
                  {variable.varLabel}
                  {variable.isRequired ? " *" : ""}
                </span>
                {variable.varType === "TEXTAREA" ? (
                  <Textarea
                    value={values[variable.varKey] ?? ""}
                    placeholder={`请输入${variable.varLabel}`}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [variable.varKey]: event.target.value,
                      }))
                    }
                  />
                ) : variable.varType === "SELECT" ? (
                  <Select
                    value={values[variable.varKey] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [variable.varKey]: event.target.value,
                      }))
                    }
                  >
                    <option value="">请选择</option>
                    {variable.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    value={values[variable.varKey] ?? ""}
                    placeholder={`请输入${variable.varLabel}`}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [variable.varKey]: event.target.value,
                      }))
                    }
                  />
                )}
              </label>
            ))}
        </div>
      </Card>

      <Card className="flex flex-col p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">最终 Prompt</p>
            <p className="text-sm text-muted">实时生成，可直接复制到 AI 工具中。</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            <Copy className="mr-2 size-4" />
            {copied ? "已复制" : "复制"}
          </Button>
        </div>

        <div className="flex flex-1 flex-col rounded-[1.5rem] border border-border bg-white/70 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted">
            <Sparkles className="size-4 text-accent" />
            Rendered Prompt
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
            {renderedPrompt}
          </pre>
        </div>
      </Card>
    </div>
  );
}
