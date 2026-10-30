import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/admin");

  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const callbackUrl = String(formData.get("callbackUrl") || "/admin");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=CredentialsSignin");
      }
      throw error;
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-forest/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-ivory p-8 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
          Haram Travel
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Restricted access for authorised staff only.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            Invalid email or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="callbackUrl" value={params.callbackUrl ?? "/admin"} />
          <label className="block text-sm font-medium text-charcoal">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none ring-gold focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-charcoal">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none ring-gold focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-l from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-charcoal hover:opacity-95"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
