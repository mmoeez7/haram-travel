import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { getSiteNavItems } from "@/lib/nav";

export const revalidate = 60;

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
      <AdminToaster />
    </>
  );
}
