"use client";

import { saveAs } from "file-saver";

interface Review {
  id: string;
  uid: string;
  name: string;
  text: string;
  stars: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface Props {
  reviews: Review[];
}

export const ExportCSVButton = ({ reviews }: Props) => {
  const exportToCSV = () => {
    const headers = ["Name", "Text", "Stars", "Date"];
    const rows = reviews.map((review) => [
      review.name,
      review.text,
      review.stars.toString(),
      new Date(review.createdAt.seconds * 1000).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "reviews.csv");
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition"
    >
      Export CSV
    </button>
  );
};
