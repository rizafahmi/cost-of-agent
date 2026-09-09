import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cost of Agent - Direktori Biaya Agen AI Coding",
  description:
    "Direktori publik biaya bulanan nyata (TCO) untuk AI coding agents populer. Seat + token + overage, bukan sekadar sticker price.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <header className="header">
          <div className="container">
            <h1 className="site-title">
              <a href="/">Cost of Agent</a>
            </h1>
            <p className="site-tagline">
              Direktori biaya nyata agen coding AI — bukan cuma sticker price
            </p>
          </div>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">
          <div className="container">
            <p>
              Data diverifikasi dari sumber publik. Biaya aktual bervariasi
              tergantung usage.
            </p>
            <p>
              <a
                href="https://github.com/rizafahmi/cost-of-agent"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
