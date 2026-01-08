import fs from "fs";
import path from "path";
import LabProfileClient from "./LabProfileClient";

type OpportunitiesData = {
  opportunities: Array<{ id: string }>;
};

export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), "public", "opportunities.json");
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(raw) as OpportunitiesData;
    return (data.opportunities ?? []).map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export default async function LabProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LabProfileClient id={id} />;
}
