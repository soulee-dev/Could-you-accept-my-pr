import { useState } from "react";
import { Renderer } from "@/components/Renderer";
import { Tooltip } from "@/components/Tooltip";
import { heatmapResult } from "@/types";

type HeatmapProps = {
  width: number;
  height: number;
  data: heatmapResult[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
  maintainers: string[];
};

export const Heatmap = ({ width, height, data }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height}
        data={data}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip interactionData={hoveredCell} width={width} height={height} />
    </div>
  );
};
