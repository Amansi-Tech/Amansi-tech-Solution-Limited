"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type StarSummaryChartProps = {
  reviews: { rating: number }[];
};

export default function StarSummaryChart({ reviews }: StarSummaryChartProps) {
  const starCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts;
  }, [reviews]);

  const data = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Review Count",
        data: starCounts,
        backgroundColor: "#7c3aed",
      },
    ],
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
        Star Rating Summary
      </h2>
      <Bar data={data} />
    </div>
  );
}
