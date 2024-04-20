import { PR, MaintainerCounts, heatmapResult } from "@/types";

function getActiveMaintainers(data: PR[]) {
  const maintainerCounts: MaintainerCounts = {};
  data.map((pr) => {
    if (pr.merged_by) {
      const maintainer = pr.merged_by.login;
      maintainerCounts[maintainer] = (maintainerCounts[maintainer] || 0) + 1;
    }
  });
  return maintainerCounts;
}

function getAverageMergeTime(data: PR[]) {
  const averageMergeTime = data.reduce((acc, pr) => {
    const mergedAt = new Date(pr.merged_at);
    const createdAt = new Date(pr.created_at);
    const diff = mergedAt.getTime() - createdAt.getTime();
    return acc + diff;
  }, 0);
  return averageMergeTime / data.length;
}

function getHeatmapData(data: PR[]): heatmapResult[] {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${(23 - i).toString().padStart(2, "0")}:00`
  );
  const heatmapData: heatmapResult[] = [];

  weekdays.forEach((day) => {
    hours.forEach((hour) => {
      const timeSlot: heatmapResult = {
        x: day,
        y: hour,
        value: 0,
        maintainers: [],
      };
      data.forEach((pr) => {
        const mergedAt = new Date(pr.merged_at);
        if (
          day === weekdays[mergedAt.getDay()] &&
          hour === `${mergedAt.getHours().toString().padStart(2, "0")}:00`
        ) {
          timeSlot.value++;
          if (!timeSlot.maintainers.includes(pr.merged_by.login)) {
            timeSlot.maintainers.push(pr.merged_by.login);
          }
        }
      });
      heatmapData.push(timeSlot);
    });
  });
  return heatmapData;
}

export { getActiveMaintainers, getAverageMergeTime, getHeatmapData };
