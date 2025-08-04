"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Review = {
  rating: number;
};

export function StarSummaryChart() {
  const [starCounts, setStarCounts] = useState([
    { rating: "1 Star", count: 0 },
    { rating: "2 Stars", count: 0 },
    { rating: "3 Stars", count: 0 },
    { rating: "4 Stars", count: 0 },
    { rating: "5 Stars", count: 0 },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const counts = [0, 0, 0, 0, 0];
      snapshot.forEach((doc) => {
        const data = doc.data() as Review;
        const rating = data.rating;
        if (rating >= 1 && rating <= 5) {
          counts[rating - 1]++;
        }
      });

      setStarCounts([
        { rating: "1 Star", count: counts[0] },
        { rating: "2 Stars", count: counts[1] },
        { rating: "3 Stars", count: counts[2] },
        { rating: "4 Stars", count: counts[3] },
        { rating: "5 Stars", count: counts[4] },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full md:w-[600px] h-[300px] bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={starCounts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="rating" stroke="#8884d8" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
