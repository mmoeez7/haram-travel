import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";
import { getSiteNavItems } from "@/lib/nav";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = await getSiteNavItems();

  return (
    <>
      <Header navItems={navItems} />
      <main>{children}</main>
      <Footer />
      <FloatingWidgets />
    </>
  );
}
