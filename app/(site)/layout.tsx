import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { GetQuoteModal } from "@/components/home/GetQuoteModal";
import { getSiteNavItems } from "@/lib/nav";

/** Render on request so `next build` does not prerender against Neon (avoids connect timeouts). */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = await getSiteNavItems();

  return (
    <>
      <SiteLoader />
      <Header navItems={navItems} />
      <main>{children}</main>
      <Footer />
      <FloatingWidgets />
      <GetQuoteModal />
      <AdminToaster />
    </>
  );
}
