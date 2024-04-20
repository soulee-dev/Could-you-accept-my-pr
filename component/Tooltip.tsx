import { InteractionData } from "@/component/Heatmap";
import styles from "./tooltip.module.css";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <div
        className={styles.tooltip}
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <TooltipRow label={"Day"} value={interactionData.xLabel} />
        <TooltipRow label={"Time"} value={interactionData.yLabel} />
        <TooltipRow label={"count"} value={String(interactionData.value)} />
        {interactionData.maintainers.length > 0 && (
          <TooltipRow
            label={"maintainers"}
            value={interactionData.maintainers.toSorted().join(", ")}
          />
        )}
      </div>
    </div>
  );
};

type TooltipRowProps = {
  label: string;
  value: string;
};

const TooltipRow = ({ label, value }: TooltipRowProps) => (
  <div>
    <b>{label}</b>
    <span>: </span>
    <span>{value}</span>
  </div>
);
