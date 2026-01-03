import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

const INDEX_URL =
  "https://science.ucsc.edu/student-support/awards-research/";
const CATEGORY = "Science";
const MAX_RESULTS = 10;
const MAX_DETAIL_FETCHES = 40;
const REQUEST_TIMEOUT_MS = 8000;

const REQUIREMENT_HEADINGS = [
  "requirements",
  "qualifications",
  "eligibility",
  "prerequisites",
  "who should apply",
  "minimum qualifications",
  "criteria",
];

const ADDITIONAL_HEADINGS = [
  "overview",
  "about",
  "description",
  "program",
  "opportunity",
  "details",
  "how to apply",
  "application",
];

const REQUIREMENT_KEYWORDS = [
  "eligible",
  "eligibility",
  "must",
  "minimum",
  "gpa",
  "require",
  "prerequisite",
  "applicant",
  "applicants",
  "coursework",
  "major",
  "standing",
];

const normalizeSpace = (value: string) =>
  value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

const stripTags = (value: string) =>
  normalizeSpace(value.replace(/<[^>]*>/g, " "));

const makeId = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

const decodeId = (value: string) => {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return "";
  }
};

const isUcscUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.hostname.endsWith("ucsc.edu");
  } catch {
    return false;
  }
};

const trimToLength = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
};

const fetchHtml = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SlugLabsBot/1.0 (research opportunities aggregator)",
      },
      next: { revalidate: 1800 },
    });
    if (!response.ok) return "";
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
};

const extractOpportunityLinksFromIndex = (html: string, baseUrl: string) => {
  const links: Array<{ url: string; title: string }> = [];
  const anchorRegex =
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null = null;

  while ((match = anchorRegex.exec(html))) {
    const [, href, innerHtml] = match;
    const headingMatch = innerHtml.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
    if (!headingMatch?.[1]) continue;

    const title = stripTags(headingMatch[1]);
    if (!title) continue;

    try {
      const resolved = new URL(href, baseUrl).toString();
      if (!isUcscUrl(resolved)) continue;
      links.push({ url: resolved, title });
    } catch {
      continue;
    }
  }

  const unique = new Map<string, string>();
  for (const link of links) {
    if (!unique.has(link.url)) {
      unique.set(link.url, link.title);
    }
  }

  return Array.from(unique.entries()).map(([url, title]) => ({ url, title }));
};

const extractTitle = (html: string) => {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) return stripTags(titleMatch[1]);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match?.[1]) return stripTags(h1Match[1]);
  return "";
};

const extractEmails = (html: string) => {
  const matches = html.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  );
  if (!matches) return [];
  const unique = new Set(
    matches.map((email) => email.toLowerCase()).filter(Boolean)
  );
  return Array.from(unique);
};

const extractSections = (html: string) => {
  const sections: Array<{ heading: string; content: string }> = [];
  const sectionRegex =
    /<h[1-6][^>]*>(.*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]|$)/gi;
  let match: RegExpExecArray | null = null;

  while ((match = sectionRegex.exec(html))) {
    const heading = stripTags(match[1]);
    const content = stripTags(match[2]);
    if (!heading || !content) continue;
    sections.push({ heading, content });
  }

  return sections;
};

const extractListItems = (html: string) => {
  const items: string[] = [];
  const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null = null;

  while ((match = itemRegex.exec(html))) {
    const text = stripTags(match[1]);
    if (text) items.push(text);
  }

  return items;
};

const findSectionText = (
  sections: Array<{ heading: string; content: string }>,
  keywords: string[]
) => {
  const match = sections.find((section) =>
    keywords.some((keyword) => section.heading.toLowerCase().includes(keyword))
  );
  return match?.content ?? "";
};

const extractRequirements = (html: string) => {
  const sections = extractSections(html);
  const sectionText = findSectionText(sections, REQUIREMENT_HEADINGS);
  if (sectionText) return sectionText;

  const listItems = extractListItems(html);
  const requirementItems = listItems.filter((item) =>
    REQUIREMENT_KEYWORDS.some((keyword) => item.toLowerCase().includes(keyword))
  );
  if (requirementItems.length > 0) {
    return requirementItems.slice(0, 4).join(" ");
  }

  return "";
};

const extractAdditionalInfo = (html: string) => {
  const sections = extractSections(html);
  const sectionText = findSectionText(sections, ADDITIONAL_HEADINGS);
  if (sectionText) return sectionText;

  const paragraphMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraphMatch?.[1]) return stripTags(paragraphMatch[1]);

  return "";
};

const buildOpportunity = async (url: string, fallbackTitle: string) => {
  const html = await fetchHtml(url);
  if (!html) return null;

  const title = extractTitle(html) || fallbackTitle;
  const emails = extractEmails(html);
  if (!title || emails.length === 0) return null;

  const requirements = extractRequirements(html);
  if (!requirements) return null;

  const additionalInfo =
    extractAdditionalInfo(html) || "See the official posting for details.";

  const source = new URL(url).hostname;
  return {
    id: makeId(url),
    title: trimToLength(title, 120),
    url,
    source,
    email: emails[0],
    requirements: trimToLength(requirements, 320),
    additionalInfo: trimToLength(additionalInfo, 360),
    category: CATEGORY,
  } satisfies Opportunity;
};

const listOpportunities = async () => {
  const indexHtml = await fetchHtml(INDEX_URL);
  if (!indexHtml) return [];

  const indexLinks = extractOpportunityLinksFromIndex(indexHtml, INDEX_URL);
  const opportunities: Opportunity[] = [];

  for (const link of indexLinks.slice(0, MAX_DETAIL_FETCHES)) {
    const opportunity = await buildOpportunity(link.url, link.title);
    if (!opportunity) continue;
    opportunities.push(opportunity);
    if (opportunities.length >= MAX_RESULTS) break;
  }

  return opportunities;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const decodedUrl = decodeId(id);
    if (!decodedUrl || !isUcscUrl(decodedUrl)) {
      return NextResponse.json({ error: "Invalid opportunity id." }, { status: 400 });
    }

    const opportunity = await buildOpportunity(decodedUrl, "");
    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    }

    return NextResponse.json({ opportunity });
  }

  const opportunities = await listOpportunities();
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    opportunities,
  });
}
