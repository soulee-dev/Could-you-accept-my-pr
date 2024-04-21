import { useMemo } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { interpolateGreens } from "d3-scale-chromatic";

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

type RendererProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: number; maintainers: string[] }[];
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
};

export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
}: RendererProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const [min = 0, max = 0] = d3.extent(data.map((d) => d.value));

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [boundsWidth, allXGroups]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [boundsHeight, allYGroups]);

  var colorScale = d3.scaleSequential(interpolateGreens).domain([min, max]);

  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.value === null || !x || !y) {
      return;
    }

    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        rx={5}
        stroke={"white"}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: d.x,
            yLabel: d.y,
            xPos: x + xScale.bandwidth() + MARGIN.left,
            yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
            value: Math.round(d.value * 100) / 100,
            maintainers: d.maintainers,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        cursor="pointer"
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    const x = xScale(name);

    if (!x) {
      return null;
    }

    return (
      <text
        key={i}
        x={x + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const y = yScale(name);

    if (!y) {
      return null;
    }

    return (
      <text
        key={i}
        x={-5}
        y={y + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allShapes}
        {xLabels}
        {yLabels}
      </g>
    </svg>
  );
};
