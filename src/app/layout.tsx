// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlugLabs",
  description: "Streamlined access to UCSC research opportunities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-shell">
        {/* Shared Header */}
        <header className="site-header">
          <div className="site-header-inner">
            <div className="brand">
              <h1 className="brand-title">
                <span className="brand-mark">Slug</span>
                <span className="brand-mark brand-mark-alt">Labs</span>
              </h1>
              <span className="brand-subtitle">UCSC Research Network</span>
            </div>
            <nav className="site-nav">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/directory" className="nav-link">
                Directory
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>

        {/* Shared Footer */}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-links">
              <a href="/about" className="footer-link">
                About
              </a>
              <a href="/contact" className="footer-link">
                Contact
              </a>
              <a href="/privacy" className="footer-link">
                Privacy
              </a>
            </div>
            <p className="footer-contact">
              Contact us at: hello@sluglabs.ucsc.edu
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
