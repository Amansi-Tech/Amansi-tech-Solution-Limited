"use client";


import { saveAs } from "file-saver";

interface ReviewType {
  id: string;
  uid: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  createdAt: any;
}

type Props = {
  reviews: ReviewType[];
};


export default function ExportCSVButton({ reviews }: Props) {
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Email,Rating,Review,CreatedAt"]
        .concat(
          reviews.map(
            (r) =>
              `${r.name},"${r.email}",${r.rating},"${r.text.replace(
                /"/g,
                '""'
              )}",${new Date(r.createdAt?.seconds * 1000).toLocaleString()}`
          )
        )
        .join("\n");

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "reviews.csv");
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Download CSV
    </button>
  );
}
