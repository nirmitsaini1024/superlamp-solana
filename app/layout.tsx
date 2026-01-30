import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryProvider from "@/components/providers/query-provider";
import Wallet from "@/components/ui/wallet";
import {NextSSRPlugin} from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { PostHogProvider } from "@/components/providers/posthog-provider";


import { Toaster } from "@/components/ui/sonner";
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Okito - Solana Payment Platform",
  description: "Integrate and manage web3 Solana payments seamlessly. Fast, secure, and decentralized payment solutions for modern applications.",
  keywords: ["solana", "payments", "crypto", "web3", "blockchain", "defi", "payment gateway"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/Okito-icon.png', type: 'image/png' }
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.okito.dev',
    siteName: 'Okito',
    title: 'Okito - Solana Payment Platform',
    description: 'Integrate and manage web3 Solana payments seamlessly. Fast, secure, and decentralized payment solutions for modern applications.',
    images: [
      {
        url: 'https://i7r9sp1sl1.ufs.sh/f/e6Jhr3XgmSqYCdiMwGrRv2QHksbEhUlZO36oWtzc9dgGPB4a',
        width: 1200,
        height: 630,
        alt: 'Okito - Solana Payment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@OkitoLabs',
    creator: '@OkitoLabs',
    title: 'Okito - Solana Payment Platform',
    description: 'Integrate and manage web3 Solana payments seamlessly. Fast, secure, and decentralized payment solutions for modern applications.',
    images: ['https://i7r9sp1sl1.ufs.sh/f/e6Jhr3XgmSqYCdiMwGrRv2QHksbEhUlZO36oWtzc9dgGPB4a'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${dmSans.className} antialiased`}
      >
      <PostHogProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
          <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          >
            <QueryProvider>
              <Wallet>
                {children}
              </Wallet>
            </QueryProvider>
          </ThemeProvider>
          <Toaster />
      </PostHogProvider>
      </body>
    </html>
  );
}
