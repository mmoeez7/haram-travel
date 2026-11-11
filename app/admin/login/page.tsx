import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { LoginSubmitButton } from "@/components/admin/LoginSubmitButton";
import { AdminPasswordInput } from "@/components/admin/AdminPasswordInput";
import { AdminLoginErrorToast } from "@/components/admin/AdminLoginErrorToast";

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
      // NEXT_REDIRECT from successful signIn must rethrow.
      if (error instanceof AuthError) {
        redirect("/admin/login?error=CredentialsSignin");
      }
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink lg:grid lg:grid-cols-[60fr_40fr]">
      {/* Visual panel — slides in first (right → left), right corners only */}
      <section className="login-slide-rtl relative hidden min-h-screen overflow-hidden rounded-r-[2rem] lg:block">
        <Image
          src="/images/hero-bg.jpg"
          alt="Makkah clock tower"
          fill
          priority
          className="object-cover object-left"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-forest/20" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <p className="login-fade-up login-fade-up-delay-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
            Haram Travel
          </p>
          <h2 className="login-fade-up login-fade-up-delay-2 mt-4 max-w-lg font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-white xl:text-4xl">
            Manage sacred journeys with clarity
          </h2>
          <p className="login-fade-up login-fade-up-delay-3 mt-4 max-w-md text-sm leading-relaxed text-white/80">
            Publish Umrah and Hajj packages, hotels, and categories from one
            calm workspace built for your team.
          </p>
        </div>
      </section>

      {/* Form panel — appears after image */}
      <section className="login-panel-in relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-cream/90" />
        </div>
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
        </div>

        <div className="login-fade-up login-fade-up-delay-2 relative w-full max-w-md rounded-2xl border border-border bg-ivory p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-gold-dark md:text-4xl">
              Haram Travel
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal">
              Admin sign in
            </p>
            <p className="mt-2 text-sm text-muted">
              Restricted access for authorised staff only.
            </p>
          </div>

          <AdminLoginErrorToast show={Boolean(params.error)} />

          <form action={loginAction} className="mt-8 space-y-4">
            <input
              type="hidden"
              name="callbackUrl"
              value={params.callbackUrl ?? "/admin"}
            />
            <label className="block text-sm font-medium text-charcoal">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@haramtravel.co.uk"
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none ring-gold transition placeholder:text-muted/60 focus:ring-2"
              />
            </label>
            <label className="block text-sm font-medium text-charcoal">
              Password
              <AdminPasswordInput
                name="password"
                required
                minLength={8}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="mt-1.5"
                inputClassName="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-10 text-sm outline-none ring-gold transition placeholder:text-muted/60 focus:ring-2"
              />
            </label>
            <div className="pt-1">
              <LoginSubmitButton />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
