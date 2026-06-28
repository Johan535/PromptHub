import { AuthForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";

export default function RegisterPage() {
  return (
    <SiteShell>
      <div className="py-10">
        <AuthForm mode="register" />
      </div>
    </SiteShell>
  );
}
