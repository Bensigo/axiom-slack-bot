import { Interval } from "@axiomhq/axiom-node";

interface Aggregation {
  op: string;
  value: number;
}

interface Group {
  id: number;
  group: Record<string, unknown>;
  aggregations: Aggregation[];
}


export interface ChartData {
  xData: any[];
  yData: any[];
  yAxisName: string;
}

export function aggregateData(
  data: Array<Interval>
): ChartData | undefined {
  // Determine the available aggregation operations
  const aggregateOps = new Set<string>();
  data.forEach((item) => {
    if (item.groups) {
      item.groups.forEach((group) => {
        if (group.aggregations) {
          group?.aggregations.forEach((aggregation) => {
            if (aggregation.op.endsWith("_")) {
              aggregateOps.add(aggregation.op);
            }
          });
        }
      });
    }
  });

  // Get the name of the y-axis from the first aggregation operation
  const yAxisName = [...aggregateOps][0].slice(0, -1);

  // Aggregate the data using the available operations
  const chartData: ChartData = { xData: [], yData: [], yAxisName };
  data.forEach((item) => {
    if (item.groups) {
      const aggregateVals: Record<string, number> = {};
      item.groups.forEach((group) => {
        if (group.aggregations) {
          group.aggregations.forEach((aggregation) => {
            if (aggregation.op.endsWith("_")) {
              const op = aggregation.op.slice(0, -1);
              aggregateVals[op] = (aggregateVals[op] || 0) + aggregation.value;
            }
          });
        }
      });

      chartData.xData.push(item.startTime);
      const yValue = aggregateVals[yAxisName.toLowerCase()];
      chartData.yData.push(yValue !== undefined ? yValue : null);
    }
  });

  // Return undefined if there's no data to show on the chart
  if (chartData.xData.length === 0) {
    return undefined;
  }

  return chartData;
}
