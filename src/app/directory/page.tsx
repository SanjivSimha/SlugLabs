"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

type Opportunity = {
  id: string;
  title: string;
  url: string;
  source: string;
  email: string;
  requirements: string;
  additionalInfo: string;
  category: string;
};

type OpportunitiesResponse = {
  updatedAt: string;
  opportunities: Opportunity[];
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Directory() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_PATH}/opportunities.json`);
        if (!response.ok) {
          throw new Error("Static data not found.");
        }
        const data = (await response.json()) as OpportunitiesResponse;
        if (!isMounted) return;
        setOpportunities(data.opportunities ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setError(null);
      } catch {
        try {
          const response = await fetch("/api/research-opportunities");
          if (!response.ok) {
            throw new Error("Unable to load opportunities right now.");
          }
          const data = (await response.json()) as OpportunitiesResponse;
          if (!isMounted) return;
          setOpportunities(data.opportunities ?? []);
          setUpdatedAt(data.updatedAt ?? null);
          setError(null);
        } catch (fallbackError) {
          if (!isMounted) return;
          setError(
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unable to load opportunities right now."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOpportunities();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return opportunities;
    return opportunities.filter((item) => {
      return [
        item.title,
        item.source,
        item.email,
        item.requirements,
        item.additionalInfo,
      ].some((field) => field.toLowerCase().includes(term));
    });
  }, [opportunities, searchTerm]);

  const customStyles = {
    pageContent: {
      width: "100%",
      margin: 0,
      padding: 0,
    } as const,
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
      marginBottom: "1.5rem",
    } as const,
    title: {
      fontSize: "2.4rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    } as const,
    subtitle: {
      color: "#94a3b8",
      maxWidth: "34rem",
      marginTop: "0.5rem",
    } as const,
    updatedAt: {
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.16em",
      color: "#94a3b8",
    } as const,
    searchInput: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.6rem",
      paddingBottom: "0.6rem",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      borderRadius: "0.6rem",
      width: "100%",
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      color: "#e2e8f0",
    } as const,
    searchWrap: {
      maxWidth: "420px",
      width: "100%",
    } as const,
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "1.5rem",
      marginTop: "2rem",
    } as const,
    card: {
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(148, 163, 184, 0.18)",
      borderRadius: "1.25rem",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      minHeight: "230px",
      boxShadow: "0 18px 40px rgba(2, 6, 23, 0.35)",
    } as const,
    categoryBadge: {
      backgroundColor: "rgba(245, 197, 66, 0.2)",
      color: "#f5c526",
      padding: "0.2rem 0.5rem",
      borderRadius: "999px",
      fontWeight: 700,
      fontSize: "0.65rem",
      letterSpacing: "0.2em",
    } as const,
    cardTitle: {
      fontSize: "1.15rem",
      fontWeight: 700,
      color: "#e2e8f0",
    } as const,
    cardText: {
      fontSize: "0.95rem",
      color: "#cbd5f5",
      lineHeight: 1.5,
    } as const,
    cardButtons: {
      marginTop: "auto",
      display: "flex",
      gap: "0.75rem",
      flexWrap: "wrap",
    } as const,
    profileButton: {
      background: "linear-gradient(120deg, #2f6bff, #0ea5e9)",
      border: "none",
      color: "#fff",
      padding: "0.6rem 1.1rem",
      borderRadius: "0.75rem",
      fontWeight: 700,
      cursor: "pointer",
    } as const,
    postingButton: {
      background: "linear-gradient(120deg, #f5c526, #f8e08a)",
      border: "none",
      color: "#0b1120",
      padding: "0.6rem 1.1rem",
      borderRadius: "0.75rem",
      fontWeight: 700,
      cursor: "pointer",
    } as const,
    emptyState: {
      border: "1px dashed rgba(148, 163, 184, 0.3)",
      borderRadius: "1rem",
      padding: "1.5rem",
      color: "#94a3b8",
      marginTop: "1.5rem",
      backgroundColor: "rgba(15, 23, 42, 0.6)",
    } as const,
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div style={customStyles.pageContent}>
          <div style={customStyles.pageHeader}>
            <div>
              <h1 style={customStyles.title}>UCSC Research Opportunities</h1>
              <p style={customStyles.subtitle}>
                AI-narrowed listings with contact emails, requirements, and a
                direct link to the official posting.
              </p>
            </div>
            <div style={customStyles.searchWrap}>
              <input
                style={customStyles.searchInput}
                placeholder="Search by lab, requirement, or contact"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {updatedAt && (
                <div style={customStyles.updatedAt}>
                  Updated {formatDate(updatedAt)}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={customStyles.emptyState}>Loading opportunities...</div>
          ) : error ? (
            <div style={customStyles.emptyState}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={customStyles.emptyState}>
              No matching opportunities found.
            </div>
          ) : (
            <div style={customStyles.grid}>
              {filtered.map((item) => (
                <div key={item.id} style={customStyles.card}>
                  <div style={customStyles.categoryBadge}>{item.category}</div>
                  <div style={customStyles.cardTitle}>
                    {truncateText(item.title, 50)}
                  </div>
                  <div style={customStyles.cardText}>
                    {truncateText(item.additionalInfo, 100)}
                  </div>
                  <div style={customStyles.cardButtons}>
                    <Link href={`/directory/${item.id}`} passHref>
                      <button style={customStyles.profileButton}>
                        View profile
                      </button>
                    </Link>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <button style={customStyles.postingButton}>
                        Official posting
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
