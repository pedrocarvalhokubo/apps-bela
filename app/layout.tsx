import type { Metadata, Viewport } from "next";
import "./globals.css";
import UnifiedNav from "./components/UnifiedNav";



export const metadata: Metadata = {
  title: "Estudos da Bela",
  description: "Aplicativo de estudos da Bela para aprender, revisar e praticar para as provas.",
  applicationName: "Estudos da Bela",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Estudos da Bela",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff9ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="antialiased"
      >
        <UnifiedNav />{children}
      </body>
    </html>
  );
}
