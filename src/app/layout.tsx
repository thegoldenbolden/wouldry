import { ScrollRestoration } from "~/hooks/use-scroll-restoration";
import { ThemeProvider } from "~/components/theme";
import { sourceSans3 } from "~/lib/fonts";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const runtime = "edge";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  title: "Wouldry",
  keywords: [
    "would you rather questions",
    "hypothetical scenarios",
    "thought provoking",
    "challenging choices",
    "engaging discussions",
    "family activities",
    "conversation starters",
    "entertaining dilemmas",
    "intriguing scenarios",
  ],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={sourceSans3.className} suppressHydrationWarning>
      <body className="bg-foreground text-copy">
        <ThemeProvider>
          <div className="max-w-screen-lg pb-8 mx-auto flex flex-col gap-8">
            {children}
          </div>
          <Suspense>
            <ScrollRestoration />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
