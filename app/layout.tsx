import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LaunchSafe — Compliance Intelligence for African Businesses",
    template: "%s | LaunchSafe",
  },
  description:
    "Discover, understand, and manage regulatory compliance before and after launching your business in Africa.",
  keywords: [
    "business compliance Nigeria",
    "regulatory requirements",
    "CAC registration",
    "business permits Nigeria",
    "compliance management",
    "LaunchSafe",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "LaunchSafe",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
