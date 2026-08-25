"use client";

import { useEffect, useRef } from "react";
import type { FC } from "react";
import * as echarts from "echarts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

// ==================== Props 契约（render:device-points-chart） ====================

export interface DevicePoint {
  name: string;
  unit?: string;
  data: Array<{ time: string; value: number }>;
}

export interface DevicePointsChartProps {
  device: string;
  points: DevicePoint[];
}

// ==================== DevicePointsChart ====================

/** 设备点位时序折线图 —— 通过 render 标签协议渲染。 */
export const DevicePointsChart: FC<DevicePointsChartProps> = ({ device, points }) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = chartRef.current ?? echarts.init(ref.current);
    chartRef.current = chart;

    // x 轴:合并所有点位的时间戳并排序
    const times = Array.from(
      new Set(points.flatMap((p) => p.data.map((d) => d.time))),
    ).sort();

    const labelOf = (p: { name: string; unit?: string }) =>
      p.unit ? `${p.name} (${p.unit})` : p.name;

    chart.setOption(
      {
        tooltip: { trigger: "axis" },
        legend: { data: points.map(labelOf), top: 4, type: "scroll" },
        grid: { left: 8, right: 16, top: 40, bottom: 8, containLabel: true },
        xAxis: { type: "category", data: times, boundaryGap: false },
        yAxis: { type: "value" },
        series: points.map((p) => ({
          name: labelOf(p),
          type: "line",
          smooth: true,
          connectNulls: true,
          data: times.map((t) => {
            const d = p.data.find((x) => x.time === t);
            return d ? d.value : null;
          }),
        })),
      },
      true,
    );

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [points]);

  // 卸载时释放 echarts 实例
  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <Card className="my-2 w-full gap-0 overflow-hidden py-2">
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-blue-500" />
          <CardTitle className="text-sm">{device} · 点位趋势</CardTitle>
        </div>
      </CardHeader>
      <div ref={ref} style={{ width: "100%", height: 280 }} />
    </Card>
  );
};

/**
 * RenderRegistry 条目：向 ai-agent 注册该组件，供 render 标签协议渲染。
 * 独立组件自含注册信息（component + description + schema + rules），与 ai-agent 解耦。
 */
export const RenderRegistry = {
  component: DevicePointsChart,
  description:
    "设备点位时序折线图。当用户询问设备表点位的【时序数据、趋势、历史值、随时间变化、曲线、折线】时,【必须】用此组件渲染,禁止用表格。仅设备表(device 类型)有效。",
  schema: '{ "device": "1#泵", "points": [{ "name": "温度", "unit": "℃", "data": [{ "time": "08:00", "value": 42.1 }] }] }',
  rules: [
    "触发关键词:趋势 / 时序 / 历史 / 变化 / 曲线 / 折线 / 随时间 / 点位数据 → 必须用此组件,不得用表格替代",
    "仅设备表(device 类型)使用,非设备表绝不使用",
  ],
};

export default DevicePointsChart;
