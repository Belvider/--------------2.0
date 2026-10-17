import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/app/globals.css";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Портал навчання персоналу",
  description: "Навчальний портал для персоналу роздрібного магазину техніки",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: [
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk-UA">
      <body className={manrope.variable}>
        {children}
        <GlobalSearch />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
