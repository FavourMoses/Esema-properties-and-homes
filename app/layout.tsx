import type { Metadata, Viewport } from "next";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/site/register-sw";

export const metadata: Metadata = {
  title: "Esema Properties & Homes",
  description:
    "Quality, verified, affordable properties across Nigeria — land verification, site inspection, construction monitoring, and a trusted network of builders.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Esema",
  },
};

export const viewport: Viewport = {
  themeColor: "#142e54",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
