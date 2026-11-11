import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToaster } from "@/components/admin/AdminToaster";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLoginRoute = pathname.startsWith("/admin/login");

  // Never wrap the login screen in AdminShell — even if a session exists —
  // so a middleware/session mismatch cannot render shell+login and loop.
  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AdminToaster />
        {children}
      </div>
    );
  }

  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AdminToaster />
        {children}
      </div>
    );
  }

  return (
    <AdminShell user={{ name: session.user.name, email: session.user.email }}>
      <AdminToaster />
      {children}
    </AdminShell>
  );
}
