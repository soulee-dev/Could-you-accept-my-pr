"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type InputGroupProps = {
  ownerParam: string;
  repoParam: string;
};

const examples = [
  { owner: "facebook", repo: "react" },
  { owner: "tiangolo", repo: "fastapi" },
  { owner: "vercel", repo: "next.js" },
];

export default function InputGroup({ ownerParam, repoParam }: InputGroupProps) {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  useEffect(() => {
    setOwner(ownerParam);
    setRepo(repoParam);
  }, [ownerParam, repoParam]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (owner && repo) {
      router.push(`/${owner}/${repo}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[350px] md:w-[800px]">
      <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
        <Link className="font-bold text-2xl whitespace-nowrap" href="/">
          Could you accept my PR?
        </Link>
        <a
          href="https://github.com/soulee-dev/could-you-accept-my-pr"
          target="_blank"
        >
          <img
            width={75}
            height={20}
            alt="GitHub Repo stars"
            src="https://img.shields.io/github/stars/soulee-dev/could-you-accept-my-pr"
          ></img>
        </a>
      </div>
      <form className="flex gap-2 flex-col md:flex-row" onSubmit={handleSubmit}>
        <input
          className="border"
          type="text"
          placeholder="owner"
          onChange={(e) => setOwner(e.target.value)}
          value={owner}
        />
        <p>/</p>
        <input
          className="border"
          type="text"
          placeholder="repo"
          onChange={(e) => setRepo(e.target.value)}
          value={repo}
        />
        <button type="submit" className="border disabled:opacity-50">
          Search
        </button>
      </form>
      <div>
        <p className="font-bold">Examples:</p>
        <ul>
          {examples.map(({ owner, repo }) => (
            <li
              key={owner + repo}
              className="text-blue-500 hover:text-blue-300"
            >
              <Link href={`/${owner}/${repo}`}>
                {owner}/{repo}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
