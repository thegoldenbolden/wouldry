import { Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const source = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wouldry",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={source.className}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
