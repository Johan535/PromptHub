import { AuthForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="py-10">
        <AuthForm mode="login" />
      </div>
    </SiteShell>
  );
}
