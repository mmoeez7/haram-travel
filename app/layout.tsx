import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";
import { SITE } from "@/lib/constants";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Hajj and Umrah Packages UK | Haram Travel",
    template: `%s | ${SITE.name}`,
  },
  description:
    "ATOL-protected Hajj and Umrah packages from the UK. Walking-distance Haram hotels, UK flights, visas, and 24/7 British ground care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${ubuntu.variable} ${ubuntu.className} antialiased`}>
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWidgets />
      </body>
    </html>
  );
}
