import { NextRequest, NextResponse } from "next/server";

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

async function fetchMergedPrs(
  owner: string,
  repo: string,
  count: number = 100
) {
  let prs: any[] = [];
  let page = 1;

  if (!owner || !repo) return;

  while (prs.length < count) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${count}&page=${page}`,
      { headers }
    );
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    if (!response.ok) {
      throw new Error(`${response.status} (${response.statusText})`);
    }
    const data = await response.json();
    const filteredPrs = data.filter((pr: any) => pr.merged_at);
    prs = prs.concat(filteredPrs);

    if (filteredPrs.length === 0 || data.length < count) {
      break;
    }

    page++;
  }

  prs = prs.slice(0, count);

  const promises = prs.map((pr) => {
    return fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}`,
      { headers }
    ).then((res) => res.json());
  });

  const detailedPRs = await Promise.all(promises);
  return detailedPRs;
}

async function getAllPrData(owner: string, repo: string, count: number = 100) {
  if (!owner || !repo) return;
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=${count}`,
    { headers }
  );

  if (response.status === 404) {
    throw new Error("Repository not found");
  }

  if (!response.ok) {
    throw new Error(`${response.status} (${response.statusText})`);
  }
  const data = await response.json();
  return data;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "owner and repo query parameters are required" },
      { status: 400 }
    );
  }
  const allPrData = await getAllPrData(owner, repo);
  const mergedPrs = await fetchMergedPrs(owner, repo);

  return NextResponse.json({
    allPrData: allPrData,
    mergedPrs: mergedPrs,
  });
}
