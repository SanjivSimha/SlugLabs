"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Opportunity {
  id: string;
  title: string;
  url: string;
  source: string;
  email: string;
  requirements: string;
  additionalInfo: string;
  category: string;
}

type OpportunityResponse = {
  opportunity: Opportunity;
};

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
};

export default function LabProfile() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadOpportunity = async () => {
      try {
        const response = await fetch(
          `/api/research-opportunities?id=${encodeURIComponent(String(id))}`
        );
        if (!response.ok) {
          throw new Error("Unable to load opportunity.");
        }
        const data = (await response.json()) as OpportunityResponse;
        if (!isMounted) return;
        setOpportunity(data.opportunity ?? null);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "Unable to load opportunity."
        );
      }
    };

    if (id) {
      loadOpportunity();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return <p style={{ padding: "2rem" }}>{error}</p>;
  }

  if (!opportunity) {
    return <p style={{ padding: "2rem" }}>Loading opportunity...</p>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="main-content">
          <div className="left-column">
            <h2>{truncateText(opportunity.title, 50)}</h2>
            <div className="lab-description">
              {truncateText(opportunity.additionalInfo, 100)}
            </div>
            <div className="contact-details">
              <div className="section-title">Requirements</div>
              <div>{opportunity.requirements}</div>
            </div>
            <div className="contact-details">
              <div className="section-title">Contact</div>
              <div>Email: {opportunity.email}</div>
              <div>Category: {opportunity.category}</div>
            </div>
          </div>

          <div className="right-column">
            <div className="right-buttons">
              <a
                href={opportunity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-button"
              >
                Official posting
              </a>
              <a
                href={`mailto:${opportunity.email}`}
                className="contact-lab-button"
              >
                Contact lab
              </a>
              <a href="/directory" className="back-button">
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
