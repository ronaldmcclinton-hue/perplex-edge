import type { Metadata, Viewport } from 'next';
import "./globals.css";
import PWASetup from "@/components/PWASetup";
import DeploymentChunkRecovery from "@/components/DeploymentChunkRecovery";

export const metadata: Metadata = {
  title: "Game DNA | The Forecast Comes First",
  description: "Independent game forecasts, alternate-line probabilities, and parlay construction.",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased bg-lucrix-dark text-textPrimary font-sans selection:bg-brand-purple selection:text-white relative" suppressHydrationWarning>
        <PWASetup />
        <DeploymentChunkRecovery />
        {children}
        <footer className="lucrix-footer">
          For informational and entertainment purposes only. Not financial advice. Bet responsibly.
          If you have a gambling problem, call 1-800-GAMBLER. &copy; 2026 Game DNA.
        </footer>
      </body>
    </html>
  );
}

