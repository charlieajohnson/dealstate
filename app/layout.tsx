import type {Metadata} from "next";
import {GeistSans} from "geist/font/sans";
import {GeistMono} from "geist/font/mono";
import {Footer} from "@/components/common/Footer";
import {TopNav} from "@/components/nav/TopNav";
import {SITE_URL} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {default: "DealState", template: "%s · DealState"},
  description: "An archival state register for private-market deal teams.",
  icons: {
    icon: [
      {url: "/favicon.svg", type: "image/svg+xml"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
    ],
    apple: [{url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png"}],
  },
  openGraph: {
    title: "DealState",
    description: "One live state for every deal.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en-GB"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
