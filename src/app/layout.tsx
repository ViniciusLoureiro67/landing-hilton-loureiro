import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiltonloureiro.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hilton Loureiro — Piloto Moto1000GP",
    template: "%s | Hilton Loureiro",
  },
  description:
    "Site oficial do piloto Hilton Loureiro, profissional do Campeonato Brasileiro Moto1000GP. Resultados, calendário, patrocínios e galeria.",
  keywords: [
    "Hilton Loureiro",
    "Moto1000GP",
    "Campeonato Brasileiro de Motovelocidade",
    "piloto profissional",
    "motovelocidade",
  ],
  authors: [{ name: "Hilton Loureiro" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Hilton Loureiro",
    title: "Hilton Loureiro — Piloto Moto1000GP",
    description:
      "Site oficial do piloto Hilton Loureiro, profissional do Campeonato Brasileiro Moto1000GP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilton Loureiro — Piloto Moto1000GP",
    description:
      "Site oficial do piloto Hilton Loureiro, profissional do Campeonato Brasileiro Moto1000GP.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
