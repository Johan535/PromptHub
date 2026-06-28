import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Prompthub123", 10);
  const userPassword = await bcrypt.hash("PromptHubUser123", 10);

  const [admin, demoUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@prompthub.dev" },
      update: {},
      create: {
        email: "admin@prompthub.dev",
        username: "admin",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "demo@prompthub.dev" },
      update: {},
      create: {
        email: "demo@prompthub.dev",
        username: "demo",
        passwordHash: userPassword,
      },
    }),
  ]);

  const categoryRows = await Promise.all(
    [
      ["需求分析", "requirement-analysis"],
      ["前端开发", "frontend-development"],
      ["调试排错", "debugging"],
      ["代码 Review", "code-review"],
    ].map(([name, slug], index) =>
      prisma.category.upsert({
        where: { slug },
        update: { sortOrder: index + 1 },
        create: { name, slug, sortOrder: index + 1 },
      }),
    ),
  );

  const tagRows = await Promise.all(
    ["Next.js", "React", "SaaS", "Refactor", "Bugfix"].map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const existingPrompt = await prisma.prompt.findFirst({
    where: { title: "生成 SaaS 官网首页" },
  });

  if (!existingPrompt) {
    const prompt = await prisma.prompt.create({
      data: {
        userId: demoUser.id,
        title: "生成 SaaS 官网首页",
        summary:
          "用于让 AI 输出有产品感的 SaaS landing page，适合 Next.js 和 React 项目。",
        content:
          "你是一名资深前端工程师，请基于以下产品信息输出一个可运行的 SaaS 官网首页。产品名称：{{product_name}}。目标用户：{{target_user}}。核心卖点：{{core_value}}。技术栈：{{tech_stack}}。请输出页面结构说明、视觉方向、组件拆分建议和完整代码。",
        categoryId: categoryRows[1].id,
        visibility: "PUBLIC",
        status: "PUBLISHED",
        toolSupport: ["Cursor", "Codex", "Claude Code"],
        favoriteCount: 12,
        useCount: 35,
        variables: {
          create: [
            {
              varKey: "product_name",
              varLabel: "产品名称",
              varType: "INPUT",
              defaultValue: "PromptHub",
              isRequired: true,
              sortOrder: 1,
            },
            {
              varKey: "target_user",
              varLabel: "目标用户",
              varType: "TEXTAREA",
              defaultValue: "高频使用 AI 编程工具的开发者",
              isRequired: true,
              sortOrder: 2,
            },
            {
              varKey: "core_value",
              varLabel: "核心卖点",
              varType: "TEXTAREA",
              defaultValue: "沉淀和复用高质量 Prompt 资产",
              isRequired: true,
              sortOrder: 3,
            },
            {
              varKey: "tech_stack",
              varLabel: "技术栈",
              varType: "INPUT",
              defaultValue: "Next.js 16 + Tailwind CSS",
              isRequired: true,
              sortOrder: 4,
            },
          ],
        },
      },
    });

    await prisma.promptTag.createMany({
      data: [tagRows[0], tagRows[1], tagRows[2]].map((tag) => ({
        promptId: prompt.id,
        tagId: tag.id,
      })),
    });
  }

  const secondPrompt = await prisma.prompt.findFirst({
    where: { title: "系统化排查 Next.js 构建报错" },
  });

  if (!secondPrompt) {
    const prompt = await prisma.prompt.create({
      data: {
        userId: admin.id,
        title: "系统化排查 Next.js 构建报错",
        summary:
          "让 AI 先定位问题，再给修复路径，适合处理依赖、类型和路由构建错误。",
        content:
          "你是一名擅长工程化排错的全栈开发者。请根据以下报错信息进行系统化排查：{{error_message}}。项目背景：{{project_context}}。请按“可能原因 -> 验证步骤 -> 最小修复方案 -> 风险提示”的格式输出。",
        categoryId: categoryRows[2].id,
        visibility: "PUBLIC",
        status: "PUBLISHED",
        toolSupport: ["Cursor", "Codex", "Trae"],
        favoriteCount: 8,
        useCount: 21,
        variables: {
          create: [
            {
              varKey: "error_message",
              varLabel: "报错信息",
              varType: "TEXTAREA",
              defaultValue: "",
              isRequired: true,
              sortOrder: 1,
            },
            {
              varKey: "project_context",
              varLabel: "项目背景",
              varType: "TEXTAREA",
              defaultValue: "Next.js 项目，使用 TypeScript 和 Prisma",
              isRequired: false,
              sortOrder: 2,
            },
          ],
        },
      },
    });

    await prisma.promptTag.createMany({
      data: [tagRows[0], tagRows[4]].map((tag) => ({
        promptId: prompt.id,
        tagId: tag.id,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
