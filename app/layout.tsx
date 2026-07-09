import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaskirat Singh — Systems",
  description:
    "Consultant, systems builder, forward-deployed engineer. I don't ask how to build it — I ask how it should work. Enterprise systems, AI, and the things I build because I can't not.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Jaskirat Singh — Systems",
    description: "Enterprise solutions, AI architecture, and personal builds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='atlas-theme',s=localStorage.getItem(k),d=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.colorScheme=s==='light'||s==='dark'?s:d;}catch(e){document.documentElement.dataset.colorScheme='dark';}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
