"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../page.module.css"; // Ensure this path is correct
import Papa from "papaparse";

interface Lab {
  id: number;
  department: string;
  professor: string;
  contact: string;
  name: string;
  major: string;
  applicationLink: string;
  description: string;
}

interface CsvRow {
  Department: string;
  Professor: string;
  Contact: string;
  Name: string;
  Major: string;
  Apply: string;
  Description: string;
}

export default function LabProfile() {
  const { id } = useParams();
  const [lab, setLab] = useState<Lab | null>(null);

  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmDz9hjnoVXz6sgthlfFxb9HLI8bNDqXa7VGPG1hgCTisC5i1N28FgWR0qmHqAHBepV1fE5_YpIbyq/pub?output=csv";

    Papa.parse<CsvRow>(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const labs: Lab[] = results.data.map((row, index) => ({
          id: index + 1,
          department: row.Department || "Unknown",
          professor: row.Professor || "Unknown",
          contact: row.Contact || "N/A",
          name: row.Name || "Unknown",
          major: row.Major || "N/A",
          applicationLink: row.Apply || "#",
          description: row.Description || "No description available.",
        }));

        const foundLab = labs.find((lab) => lab.id === Number(id));
        setLab(foundLab || null);
      },
    });
  }, [id]);

  if (!lab) {
    return <p className={styles.loading}>Loading lab details...</p>;
  }
  return (
    <div className="page-container">
      <div className="container">
        <div className="main-content">
          <div className="left-column">
            <h2>{lab.name}</h2>
            <div className="lab-description">{lab.description}</div>
            <div className="contact-details">
              <div className="section-title">Contact Details</div>
              <div>Email: {lab.contact}</div>
              {lab.professor && <div>Professor: {lab.professor}</div>}
            </div>
          </div>

          <div className="right-column">
            <div className="right-buttons">
              <a
                href={lab.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-button"
              >
                Apply!
              </a>
              <a href={`mailto:${lab.contact}`} className="contact-lab-button">
                Contact Lab!
              </a>
              <a href="./" className="back-button">
                Back to SlugLabs Directory
              </a>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 2rem 1.25rem 3rem;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background-color: rgba(15, 23, 42, 0.85);
          box-shadow: 0 25px 60px rgba(2, 6, 23, 0.45);
          flex: 1;
          width: 100%;
          border-radius: 24px;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .header {
          background-color: rgba(8, 12, 24, 0.9);
          padding: 15px 20px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
        }
        .logo-text-lab {
          color: #e2e8f0;
          font-size: 28px;
          font-weight: bold;
        }
        .logo-text-ucsc {
          color: #f5c526;
          font-size: 28px;
          font-weight: bold;
        }
        .nav-button {
          background-color: rgba(47, 107, 255, 0.2);
          padding: 5px 15px;
          border-radius: 5px;
          color: #e2e8f0;
          text-decoration: none;
          font-size: 16px;
        }
        .main-content {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          padding: 2.5rem;
          gap: 2rem;
          min-height: 400px;
        }
        .left-column {
          flex: 7;
          padding-right: 40px;
        }
        .right-column {
          flex: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        h2 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin-top: 0;
          margin-bottom: 20px;
          color: #e2e8f0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .lab-description {
          margin-bottom: 30px;
          font-size: 18px;
          line-height: 1.6;
          color: #cbd5f5;
        }
        .section-title {
          font-size: 24px;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 15px;
          color: #f5c526;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .contact-details {
          margin-bottom: 30px;
          font-size: 18px;
          line-height: 1.6;
          color: #cbd5f5;
        }
        .right-buttons {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .apply-button {
          display: block;
          width: 90%;
          background: linear-gradient(120deg, #f5c526, #f8e08a);
          border: none;
          color: #0b1120;
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 18px 30px rgba(245, 197, 66, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .apply-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 34px rgba(245, 197, 66, 0.35);
        }
        .contact-lab-button {
          display: block;
          width: 90%;
          background: linear-gradient(120deg, #2f6bff, #0ea5e9);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 18px 30px rgba(47, 107, 255, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .contact-lab-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 36px rgba(47, 107, 255, 0.45);
        }
        .back-button {
          display: block;
          width: 90%;
          background-color: rgba(148, 163, 184, 0.1);
          color: #e2e8f0;
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          transition: background-color 0.2s, color 0.2s;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .back-button:hover {
          background-color: rgba(148, 163, 184, 0.2);
          color: #f8fafc;
        }
        .loading {
          text-align: center;
          padding: 50px;
          font-size: 20px;
          color: #94a3b8;
        }
        @media (max-width: 900px) {
          .main-content {
            grid-template-columns: 1fr;
            padding: 2rem;
          }

          .left-column {
            padding-right: 0;
          }
        }
      `}</style>
    </div>
  );
}
