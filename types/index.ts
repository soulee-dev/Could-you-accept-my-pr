type PR = {
  merged_at: string;
  created_at: string;
  merged_by: {
    login: string;
  };
};

type MaintainerCounts = {
  [key: string]: number;
};

type heatmapResult = {
  x: string;
  y: string;
  value: number;
  maintainers: string[];
};

export type { PR, MaintainerCounts, heatmapResult };
