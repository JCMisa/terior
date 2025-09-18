"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  rooms: {
    label: "Rooms redesigned",
    color: "#ff3d00", // exact color you asked for
  },
} satisfies ChartConfig;

export function UserRoomsPerMonthChart() {
  const [data, setData] = React.useState<
    { month: string; rooms: number }[] | null
  >(null);

  React.useEffect(() => {
    fetch("/api/analytics/rooms-per-month")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setData([]));
  }, []);

  if (!data) return null; // or a skeleton loader

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rooms redesigned this year</CardTitle>
        <CardDescription>Monthly breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb …
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="rooms"
              type="linear"
              fill={chartConfig.rooms.color}
              fillOpacity={0.4}
              stroke={chartConfig.rooms.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
