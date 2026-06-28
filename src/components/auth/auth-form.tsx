"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({
  mode,
}: {
  mode: "login" | "register";
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const username = String(formData.get("username") ?? "");

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("邮箱或密码不正确。");
          return;
        }

        router.push("/me/prompts");
        router.refresh();
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message ?? "注册失败，请稍后再试。");
        return;
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push("/me/prompts");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <Card className="mx-auto w-full max-w-md p-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          {isLogin ? "Login" : "Register"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {isLogin ? "登录 PromptHub" : "创建 PromptHub 账号"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {isLogin
            ? "使用邮箱和密码登录，进入你的 Prompt 资产空间。"
            : "注册后可以创建、收藏和管理属于自己的 Prompt 资产。"}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium">用户名</span>
            <Input name="username" placeholder="输入你的用户名" />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium">邮箱</span>
          <Input name="email" type="email" placeholder="name@example.com" />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">密码</span>
          <Input name="password" type="password" placeholder="输入密码" />
        </label>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : isLogin ? "登录" : "注册"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {isLogin ? "还没有账号？" : "已经有账号？"}
        {" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-medium text-primary"
        >
          {isLogin ? "去注册" : "去登录"}
        </Link>
      </p>
    </Card>
  );
}
