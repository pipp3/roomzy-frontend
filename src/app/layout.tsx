import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roomzy - Encuentra tu hogar ideal",
  description: "Plataforma para encontrar y compartir espacios de vivienda perfectos para ti",
  icons: {
    icon: [
      { url: '/ico/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/ico/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/ico/favicon.ico', sizes: 'any' },
    ],
    apple: '/ico/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome',
        url: '/ico/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome',
        url: '/ico/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
