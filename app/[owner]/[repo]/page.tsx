"use client";

import { useCallback, useEffect, useState } from "react";
import { Heatmap } from "@/components/Heatmap";
import Link from "next/link";
import LoadingComponent from "@/components/LoadingComponent";
import { heatmapResult, MaintainerCounts, PR } from "@/types";
import {
  getActiveMaintainers,
  getAverageMergeTime,
  getHeatmapData,
} from "@/utils";
import InputGroup from "@/components/InputGroup";

type HomeProps = {
  params: { owner: string; repo: string };
};

export default function Home({ params }: HomeProps) {
  const owner = params.owner;
  const repo = params.repo;
  const [averageMergeTime, setAverageMergeTime] = useState("");
  const [allPrData, setAllPrData] = useState<PR[] | null>(null);
  const [mergedPrs, setMergedPrs] = useState<PR[] | null>(null);
  const [percentageOfMergedPrs, setPercentageOfMergedPrs] = useState(0);
  const [activeMaintainers, setActiveMaintainers] =
    useState<MaintainerCounts | null>(null);
  const [heatmapResultData, setHeatmapResultData] = useState<
    heatmapResult[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const size = useWindowSize();

  function useWindowSize() {
    const isClient = typeof window === "object";

    const getSize = useCallback(() => {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined,
      };
    }, [isClient]);

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [getSize, isClient]);

    return windowSize;
  }

  useEffect(() => {
    if (!mergedPrs) return;
    const averageMergeTime = getAverageMergeTime(mergedPrs);
    const days = Math.floor(averageMergeTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (averageMergeTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    setAverageMergeTime(`${days} days and ${hours} hours`);

    setActiveMaintainers(getActiveMaintainers(mergedPrs));
    setHeatmapResultData(getHeatmapData(mergedPrs));
  }, [mergedPrs]);

  useEffect(() => {
    if (!allPrData) return;
    const filterdPRs = allPrData.filter((pr) => pr.merged_at);
    setPercentageOfMergedPrs((filterdPRs.length / allPrData.length) * 100);
  }, [allPrData]);

  async function getData() {
    if (!owner || !repo) return;
    const response = await fetch(`/api?owner=${owner}&repo=${repo}`);
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    if (!response.ok) {
      throw new Error(`${response.status} (${response.statusText})`);
    }
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    if (!owner || !repo) return;
    setIsLoading(true);
    getData()
      .then((data) => {
        setAllPrData(data.allPrData);
        setMergedPrs(data.mergedPrs);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessages(error.message);
        setIsLoading(false);
      });
  }, [owner, repo]);

  return (
    <div className="flex flex-col gap-4 w-[350px] md:w-[800px]">
      <InputGroup ownerParam={owner} repoParam={repo} />
      {errorMessages && (
        <div className="text-red-500">
          <p>Error: {errorMessages}</p>
        </div>
      )}
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className={`${activeMaintainers ? "" : "hidden"}`}>
          <p className="font-bold">Statistics:</p>
          <p className="text-xs">from recent 100 pr</p>
          <br />
          <p>Percentage of merged: {percentageOfMergedPrs}%</p>
          <p>Average merge time: {averageMergeTime}</p>
          <br />
          <p>Active maintainers</p>
          <ul>
            {activeMaintainers &&
              Object.entries(activeMaintainers)
                .sort((a, b) => b[1] - a[1])
                .map(([maintainer, count]) => (
                  <li key={maintainer}>
                    <Link
                      className="text-blue-500 hover:text-blue-300"
                      href={`https://github.com/${maintainer}`}
                    >
                      {maintainer}
                    </Link>
                    : {count} pr
                  </li>
                ))}
          </ul>
          <br />
          <p>Heatmap of merged PRs:</p>
          <div>
            {heatmapResultData && (
              <Heatmap
                width={(size.width ?? 700) < 700 ? 350 : 700}
                height={600}
                data={heatmapResultData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
