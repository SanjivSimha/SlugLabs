"use client"; // Required for Next.js when using state/hooks in app directory

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Landing() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      console.log("Selected file:", file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className={styles.container}>
      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.logoSection}>
              <h1 className={styles.logoText}>
                <span className={styles.brandSlug}>Slug</span>
                <span className={styles.brandLabs}>Labs</span>
              </h1>

              <p className={styles.heroLead}>
                Streamlined access to UCSC research roles, matched to your
                skills in minutes.
              </p>

              <div className={styles.badgeRow}>
                <span className={styles.badge}>Personalized matches</span>
                <span className={styles.badge}>Fast apply</span>
                <span className={styles.badge}>Faculty verified</span>
              </div>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.panelHeader}>New this week</div>
            <div className={styles.panelBody}>
              <div className={styles.panelCard}>
                <p className={styles.panelTitle}>AI + Vision Labs</p>
                <p className={styles.panelMeta}>7 openings • B.S. + M.S.</p>
              </div>
              <div className={styles.panelCard}>
                <p className={styles.panelTitle}>Marine Genomics</p>
                <p className={styles.panelMeta}>4 openings • Undergrad</p>
              </div>
              <div className={styles.panelCard}>
                <p className={styles.panelTitle}>Quantum Materials</p>
                <p className={styles.panelMeta}>5 openings • Ph.D.</p>
              </div>
            </div>
          </div>
        </section>

        {/* File Upload Section */}
        <section className={styles.uploadSection}>
          <div>
            {/* Hidden file input */}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="pdf-upload"
            />

            {/* Button that triggers file input */}
            <label htmlFor="pdf-upload" className={styles.uploadButton}>
              <svg
                className={styles.uploadIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Upload your transcript or resume
            </label>
          </div>

          {/* File Upload Display (Only shows if file is selected) */}
          {selectedFile && (
            <div className={styles.fileDisplay}>
              <div className={styles.fileContainer}>
                <div className={styles.fileHeader}>FILE NAME</div>
                <div className={styles.fileContent}>
                  <span className={styles.fileName}>{selectedFile.name}</span>
                  <button
                    className={styles.deleteButton}
                    onClick={handleRemoveFile}
                  >
                    <svg
                      className={styles.deleteIcon}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Connect Button */}
          <div>
            <Link href="/directory" passHref>
              <button className={styles.connectButton}>
                Start Matching
              </button>
            </Link>
          </div>
        </section>

        <section className={styles.featureRow}>
          <div className={styles.featureHeader}>
            <h2 className={styles.featureTitle}>Trending on SlugLabs</h2>
            <p className={styles.featureSubtitle}>
              Dive into spotlight research areas and discover labs taking new
              students now.
            </p>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <p className={styles.featureTag}>Blue-Gold Picks</p>
              <h3 className={styles.featureName}>Systems + Security</h3>
              <p className={styles.featureMeta}>12 labs • remote friendly</p>
            </div>
            <div className={styles.featureCard}>
              <p className={styles.featureTag}>Gold Rush</p>
              <h3 className={styles.featureName}>Biotech Innovation</h3>
              <p className={styles.featureMeta}>9 labs • funded positions</p>
            </div>
            <div className={styles.featureCard}>
              <p className={styles.featureTag}>Top Rated</p>
              <h3 className={styles.featureName}>Climate Futures</h3>
              <p className={styles.featureMeta}>6 labs • cross-discipline</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
