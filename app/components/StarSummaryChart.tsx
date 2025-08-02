"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Review {
  stars: number;
}

interface Props {
  reviews: Review[];
}

export const StarSummaryChart = ({ reviews }: Props) => {
  const starCounts = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((r) => r.stars === star).length,
  }));

  return (
    <div className="bg-white/10 p-4 rounded-2xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Star Distribution</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={starCounts}>
          <XAxis dataKey="star" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#a78bfa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
