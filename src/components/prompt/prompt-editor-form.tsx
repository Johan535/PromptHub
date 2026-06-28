"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PromptItem, ToolName } from "@/types/prompt";

type DraftVariable = {
  id: string;
  varKey: string;
  varLabel: string;
  varType: "INPUT" | "TEXTAREA" | "SELECT";
  isRequired: boolean;
  defaultValue: string;
};

const toolOptions: ToolName[] = [
  "Cursor",
  "Claude Code",
  "Codex",
  "Windsurf",
  "Trae",
];

export function PromptEditorForm({
  categories,
  initialPrompt,
}: {
  categories: Array<{ id: string; name: string }>;
  initialPrompt?: PromptItem;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPrompt?.title ?? "");
  const [summary, setSummary] = useState(initialPrompt?.summary ?? "");
  const [content, setContent] = useState(initialPrompt?.content ?? "");
  const [categoryId, setCategoryId] = useState(
    initialPrompt?.category.id ?? categories[0]?.id ?? "",
  );
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    initialPrompt?.visibility ?? "PUBLIC",
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialPrompt?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  );
  const [selectedTools, setSelectedTools] = useState<ToolName[]>(
    initialPrompt?.toolSupport ?? [],
  );
  const [tagText, setTagText] = useState(
    initialPrompt?.tags.map((tag) => tag.name).join(", ") ?? "",
  );
  const [variables, setVariables] = useState<DraftVariable[]>(
    initialPrompt?.variables.length
      ? initialPrompt.variables.map((variable) => ({
          id: variable.id,
          varKey: variable.varKey,
          varLabel: variable.varLabel,
          varType: variable.varType,
          isRequired: variable.isRequired,
          defaultValue: variable.defaultValue ?? "",
        }))
      : [
          {
            id: "draft-1",
            varKey: "project_name",
            varLabel: "项目名称",
            varType: "INPUT",
            isRequired: true,
            defaultValue: "",
          },
        ],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateVariable(id: string, patch: Partial<DraftVariable>) {
    setVariables((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function toggleTool(tool: ToolName) {
    setSelectedTools((current) =>
      current.includes(tool)
        ? current.filter((item) => item !== tool)
        : [...current, tool],
    );
  }

  async function submitPrompt(nextStatus: "DRAFT" | "PUBLISHED") {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        initialPrompt ? `/api/prompts/${initialPrompt.id}` : "/api/prompts",
        {
          method: initialPrompt ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            summary,
            content,
            categoryId,
            visibility,
            status: nextStatus,
            toolSupport: selectedTools,
            tags: tagText
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            variables: variables.map((variable, index) => ({
              varKey: variable.varKey.trim(),
              varLabel: variable.varLabel.trim(),
              varType: variable.varType,
              defaultValue: variable.defaultValue,
              options: [],
              isRequired: variable.isRequired,
              sortOrder: index + 1,
            })),
          }),
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(result.message ?? "保存失败，请稍后重试。");
        return;
      }

      router.push("/me/prompts");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function deletePrompt() {
    if (!initialPrompt) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/prompts/${initialPrompt.id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(result?.message ?? "删除失败，请稍后重试。");
        return;
      }

      router.push("/me/prompts");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight">基础信息</h2>
            <p className="mt-1 text-sm text-muted">
              先把标题、简介和 Prompt 正文定清楚。
            </p>
          </div>
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">标题</span>
              <Input
                value={title}
                placeholder="例如：生成可上线的 SaaS 官网首页"
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">简介</span>
              <Textarea
                className="min-h-[100px]"
                value={summary}
                placeholder="一句话说明这个 Prompt 适用于什么场景。"
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Prompt 正文</span>
              <Textarea
                className="min-h-[260px]"
                value={content}
                placeholder="你是一名资深前端工程师，请根据以下需求输出..."
                onChange={(event) => setContent(event.target.value)}
              />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">变量定义</h2>
              <p className="mt-1 text-sm text-muted">
                变量会渲染成表单，供用户快速补全上下文。
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setVariables((current) => [
                  ...current,
                  {
                    id: `draft-${current.length + 1}`,
                    varKey: "",
                    varLabel: "",
                    varType: "INPUT",
                    isRequired: false,
                    defaultValue: "",
                  },
                ])
              }
            >
              <Plus className="mr-2 size-4" />
              添加变量
            </Button>
          </div>

          <div className="space-y-4">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className="grid gap-3 rounded-[1.5rem] border border-border bg-white/70 p-4 md:grid-cols-2"
              >
                <label className="space-y-2">
                  <span className="text-sm font-medium">变量标识</span>
                  <Input
                    value={variable.varKey}
                    placeholder="project_name"
                    onChange={(event) =>
                      updateVariable(variable.id, { varKey: event.target.value })
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">变量名称</span>
                  <Input
                    value={variable.varLabel}
                    placeholder="项目名称"
                    onChange={(event) =>
                      updateVariable(variable.id, {
                        varLabel: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">变量类型</span>
                  <Select
                    value={variable.varType}
                    onChange={(event) =>
                      updateVariable(variable.id, {
                        varType: event.target.value as DraftVariable["varType"],
                      })
                    }
                  >
                    <option value="INPUT">单行输入</option>
                    <option value="TEXTAREA">多行文本</option>
                    <option value="SELECT">下拉选择</option>
                  </Select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">默认值</span>
                  <Input
                    value={variable.defaultValue}
                    placeholder="可选"
                    onChange={(event) =>
                      updateVariable(variable.id, {
                        defaultValue: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="col-span-full flex items-center justify-between rounded-2xl bg-background px-4 py-3">
                  <span className="text-sm font-medium">设为必填</span>
                  <input
                    type="checkbox"
                    checked={variable.isRequired}
                    onChange={(event) =>
                      updateVariable(variable.id, {
                        isRequired: event.target.checked,
                      })
                    }
                  />
                </label>
                <div className="col-span-full flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger"
                    onClick={() =>
                      setVariables((current) =>
                        current.filter((item) => item.id !== variable.id),
                      )
                    }
                  >
                    <Trash2 className="mr-2 size-4" />
                    删除变量
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight">发布设置</h2>
            <p className="mt-1 text-sm text-muted">
              给 Prompt 配上分类、工具和可见性。
            </p>
          </div>
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">分类</span>
              <Select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">适配工具</span>
              <div className="flex flex-wrap gap-2">
                {toolOptions.map((tool) => (
                  <button
                    type="button"
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                      selectedTools.includes(tool)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">标签</span>
              <Input
                value={tagText}
                placeholder="例如：Next.js, React, SaaS"
                onChange={(event) => setTagText(event.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">可见性</span>
              <Select
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as "PUBLIC" | "PRIVATE")
                }
              >
                <option value="PUBLIC">公开</option>
                <option value="PRIVATE">私有</option>
              </Select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">状态</span>
              <Select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "DRAFT" | "PUBLISHED")
                }
              >
                <option value="DRAFT">草稿</option>
                <option value="PUBLISHED">发布</option>
              </Select>
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight">提交动作</h2>
            <p className="mt-1 text-sm text-muted">
              现在已经接入真实保存逻辑，可以直接提交到数据库。
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button
              type="button"
              disabled={submitting}
              onClick={() => submitPrompt("DRAFT")}
            >
              {submitting ? "提交中..." : "保存草稿"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={() => submitPrompt("PUBLISHED")}
            >
              {submitting ? "提交中..." : "发布 Prompt"}
            </Button>
            {initialPrompt ? (
              <Button
                type="button"
                variant="danger"
                disabled={submitting}
                onClick={deletePrompt}
              >
                删除 Prompt
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
    </form>
  );
}
