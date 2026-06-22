import type {Metadata} from "next";
import {Fraunces} from "next/font/google";
import {GeistSans} from "geist/font/sans";
import {GeistMono} from "geist/font/mono";
import {Footer} from "@/components/common/Footer";
import {TopNav} from "@/components/nav/TopNav";
import "./globals.css";

const fraunces = Fraunces({subsets: ["latin"], style: "normal", variable: "--font-fraunces", display: "swap"});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {default: "DealState", template: "%s · DealState"},
  description: "A source-backed opportunity centre for private-market deal teams.",
  openGraph: {
    title: "DealState",
    description: "One live state for every deal.",
    images: ["/opengraph-image"],
  },
};

const themeScript = `(function(){try{var s=localStorage.getItem('dealstate-theme');document.documentElement.classList.toggle('dark',s==='dark')}catch(e){}})()`;

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: themeScript}} />
      </head>
      <body>
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
