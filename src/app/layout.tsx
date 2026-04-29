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
    default: "Hilton Loureiro 76 — Piloto profissional 600cc Master",
    template: "%s | Hilton Loureiro 76",
  },
  description:
    "Site oficial do piloto Hilton Loureiro #76. Bicampeão Brasileiro Endurance 600cc, na categoria 600cc Master pela equipe NRT. Calendário, palmarés, galeria e patrocínio.",
  keywords: [
    "Hilton Loureiro",
    "Hilton 76",
    "Campeonato Brasileiro de Motovelocidade",
    "600cc Master",
    "Endurance 600cc",
    "piloto profissional",
    "motovelocidade Brasil",
    "Kawasaki ZX6R",
    "NRT",
    "Garagem 57",
  ],
  authors: [{ name: "Hilton Loureiro" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Hilton Loureiro 76",
    title: "Hilton Loureiro 76 — Piloto profissional 600cc Master",
    description:
      "Bicampeão Brasileiro Endurance 600cc, na categoria 600cc Master pela equipe NRT.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilton Loureiro 76 — Piloto profissional 600cc Master",
    description:
      "Bicampeão Brasileiro Endurance 600cc, na categoria 600cc Master pela equipe NRT.",
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
