"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { toLocaleStringWithCommas } from "@/lib/utils";
type PieData = {
  label: string;
  value: number;
  color: string;
};
type DonutChartProps = {
  totalSpent: number;
  totalBudget: number;
  data: PieData[];
};

const DonutChart = ({ totalSpent, totalBudget, data }: DonutChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 240;
    const height = 240;
    const radius = Math.min(width, height) / 2;
    const innerRadius = Math.min(width, height) / 3.5; //
    if (data.length === 0) {
      return; // No data to render
    }
    const pie = d3.pie<PieData>().value((d: PieData) => d.value);
    const tooltip = d3.select(toolTipRef.current);
    const arc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(innerRadius) // 0 for full pie; >0 for donut
      .outerRadius(radius - 10);
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = g
      .selectAll("arc")
      .data(
        pie(
          data.map((d) => ({
            label: d.label,
            value: d.value,
            color: d.color,
          }))
        )
      )
      .enter()
      .append("g");
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: d3.PieArcDatum<PieData>) => d.data.color)
      .on("mouseenter", function (event, d) {
        const [x, y] = d3.pointer(event);
        tooltip
          .style("display", "block")
          .style("left", `${x + width / 2 + 10}px`)
          .style("top", `${y + height / 2}px`).html(`
                    <div style="padding: 6px 12px; background: ${
                      d.data.color
                    }; color: #fff;  border-radius: 5px;
                    font-family: 'Public Sans', sans-serif; font-size: 16px; display: flex; flex-direction: column; gap: 2px;">
                    <strong>${d.data.label}</strong>
              <p style="font-weight:500" >${toLocaleStringWithCommas(d.data.value, "USD", 2)}</p>
                    </div>
                  `);
      })
      .on("mouseleave", () => {
        tooltip.style("display", "none");
      });

    const centerDonut = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(Math.min(width, height) / 2.8) // slightly larger for the ring look
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", centerDonut as any)
      .attr("fill", "rgba(255, 255, 255, 0.3)");
  });
  return (
    <div className="relative">
      <svg ref={ref}></svg>
      <div
        ref={toolTipRef}
        style={{
          position: "absolute",
          display: "none",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-2">
        <h1 className="text-grey-900 text-preset-1">
          {toLocaleStringWithCommas(totalSpent, "USD", 0)}
        </h1>
        <p className="text-preset-5 text-grey-500 text-center">
          of {toLocaleStringWithCommas(totalBudget, "USD", 0)} limit
        </p>
      </div>
    </div>
  );
};

export default DonutChart;
