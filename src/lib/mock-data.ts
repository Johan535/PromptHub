import { PromptItem } from "@/types/prompt";

export const categories = [
  { id: "cat-1", name: "需求分析", slug: "requirement-analysis" },
  { id: "cat-2", name: "前端开发", slug: "frontend-development" },
  { id: "cat-3", name: "调试排错", slug: "debugging" },
  { id: "cat-4", name: "代码 Review", slug: "code-review" },
];

export const tags = [
  { id: "tag-1", name: "Next.js" },
  { id: "tag-2", name: "React" },
  { id: "tag-3", name: "SaaS" },
  { id: "tag-4", name: "Refactor" },
  { id: "tag-5", name: "Bugfix" },
];

export const prompts: PromptItem[] = [
  {
    id: "prompt-1",
    title: "生成 SaaS 官网首页",
    summary:
      "用于让 AI 输出有产品感的 SaaS landing page，适合 Next.js 和 React 项目。",
    content:
      "你是一名资深前端工程师，请基于以下产品信息输出一个可运行的 SaaS 官网首页。产品名称：{{product_name}}。目标用户：{{target_user}}。核心卖点：{{core_value}}。技术栈：{{tech_stack}}。请输出页面结构说明、视觉方向、组件拆分建议和完整代码。",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    toolSupport: ["Cursor", "Codex", "Claude Code"],
    favoriteCount: 128,
    useCount: 364,
    createdAt: "2026-06-21T09:00:00.000Z",
    updatedAt: "2026-06-24T14:30:00.000Z",
    author: { id: "user-1", username: "Aster" },
    category: categories[1],
    tags: [tags[0], tags[1], tags[2]],
    variables: [
      {
        id: "var-1",
        varKey: "product_name",
        varLabel: "产品名称",
        varType: "INPUT",
        defaultValue: "PromptHub",
        isRequired: true,
        sortOrder: 1,
      },
      {
        id: "var-2",
        varKey: "target_user",
        varLabel: "目标用户",
        varType: "TEXTAREA",
        defaultValue: "高频使用 AI 编程工具的开发者",
        isRequired: true,
        sortOrder: 2,
      },
      {
        id: "var-3",
        varKey: "core_value",
        varLabel: "核心卖点",
        varType: "TEXTAREA",
        defaultValue: "沉淀和复用高质量 Prompt 资产",
        isRequired: true,
        sortOrder: 3,
      },
      {
        id: "var-4",
        varKey: "tech_stack",
        varLabel: "技术栈",
        varType: "INPUT",
        defaultValue: "Next.js 15 + Tailwind CSS",
        isRequired: true,
        sortOrder: 4,
      },
    ],
  },
  {
    id: "prompt-2",
    title: "系统化排查 Next.js 构建报错",
    summary:
      "让 AI 先定位问题，再给修复路径，适合处理依赖、类型和路由构建错误。",
    content:
      "你是一名擅长工程化排错的全栈开发者。请根据以下报错信息进行系统化排查：{{error_message}}。项目背景：{{project_context}}。请按“可能原因 -> 验证步骤 -> 最小修复方案 -> 风险提示”的格式输出。",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    toolSupport: ["Cursor", "Codex", "Trae"],
    favoriteCount: 84,
    useCount: 205,
    createdAt: "2026-06-15T08:00:00.000Z",
    updatedAt: "2026-06-22T11:00:00.000Z",
    author: { id: "user-2", username: "Jun" },
    category: categories[2],
    tags: [tags[0], tags[4]],
    variables: [
      {
        id: "var-5",
        varKey: "error_message",
        varLabel: "报错信息",
        varType: "TEXTAREA",
        defaultValue: "",
        isRequired: true,
        sortOrder: 1,
      },
      {
        id: "var-6",
        varKey: "project_context",
        varLabel: "项目背景",
        varType: "TEXTAREA",
        defaultValue: "Next.js 项目，使用 TypeScript 和 Prisma",
        isRequired: false,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prompt-3",
    title: "PRD 转开发任务拆解",
    summary:
      "把产品需求文档拆成前后端可执行任务，适合独立开发和小团队协作。",
    content:
      "你现在扮演技术 PM，请根据以下 PRD 内容输出开发任务拆解。PRD：{{prd_content}}。请拆成前端、后端、数据、接口、测试五部分，并标注优先级和依赖关系。",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    toolSupport: ["Claude Code", "Codex", "Windsurf"],
    favoriteCount: 57,
    useCount: 144,
    createdAt: "2026-06-10T08:00:00.000Z",
    updatedAt: "2026-06-20T11:00:00.000Z",
    author: { id: "user-3", username: "Mina" },
    category: categories[0],
    tags: [tags[2]],
    variables: [
      {
        id: "var-7",
        varKey: "prd_content",
        varLabel: "PRD 内容",
        varType: "TEXTAREA",
        defaultValue: "",
        isRequired: true,
        sortOrder: 1,
      },
    ],
  },
];

export function getPromptById(id: string) {
  return prompts.find((prompt) => prompt.id === id);
}
