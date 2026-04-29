import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Saira_Condensed } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sairaCondensed = Saira_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiltonloureiro.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hilton Loureiro 76 — Piloto Moto1000GP",
    template: "%s | Hilton Loureiro 76",
  },
  description:
    "Site oficial do piloto Hilton Loureiro #76. Bicampeão Brasileiro Endurance 600cc, agora no Campeonato Brasileiro Moto1000GP. Calendário, palmarés, galeria e patrocínio.",
  keywords: [
    "Hilton Loureiro",
    "Hilton 76",
    "Moto1000GP",
    "Campeonato Brasileiro de Motovelocidade",
    "Endurance 600cc",
    "piloto profissional",
    "motovelocidade Brasil",
    "PRT Racing",
    "Garagem 53",
  ],
  authors: [{ name: "Hilton Loureiro" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Hilton Loureiro 76",
    title: "Hilton Loureiro 76 — Piloto Moto1000GP",
    description:
      "Bicampeão Brasileiro Endurance 600cc, agora na principal categoria da motovelocidade nacional.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilton Loureiro 76 — Piloto Moto1000GP",
    description:
      "Bicampeão Brasileiro Endurance 600cc, agora na principal categoria da motovelocidade nacional.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${sairaCondensed.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-racing-blue-bright selection:text-racing-white">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
