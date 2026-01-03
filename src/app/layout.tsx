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
<<<<<<< HEAD
        <header className="site-header">
          <div className="site-header-inner">
            <div className="brand">
              <h1 className="brand-title">
                <span className="brand-mark">Slug</span>
                <span className="brand-mark brand-mark-alt">Labs</span>
=======
        <header
          style={{
            backgroundColor:" #F3F2DF",
            padding: "1rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>
                <span style={{ fontWeight: "bold", color: "#2D5C34" }}>
                  Slug
                </span>
                <span style={{ fontWeight: "bold", color: "#8CC63F" }}>
                  Labs
                </span>
>>>>>>> d04ea89d2a2b1ef2cebd4df424c6e3ed115a1234
              </h1>
              <span className="brand-subtitle">UCSC Research Network</span>
            </div>
<<<<<<< HEAD
            <nav className="site-nav">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/directory" className="nav-link">
=======
            <nav style={{ display: "flex", gap: "1rem" }}>
              <Link
                href="/"
                style={{
                  color: "#2D5C34",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Home
              </Link>
              <Link
                href="/directory"
                style={{
                  color: "#2D5C34",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
>>>>>>> d04ea89d2a2b1ef2cebd4df424c6e3ed115a1234
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
