import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cost of Agent - Biaya Nyata Agen Coding AI",
  description:
    "Direktori biaya agen coding AI — harga nyata bulanan (seat + token + overage), bukan sticker. Bahasa Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
