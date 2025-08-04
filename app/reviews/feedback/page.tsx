"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Star, Trash2, } from "lucide-react";
import { toast } from "sonner";
import { StarSummaryChart } from "../../components/StarSummaryChart";

type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Review[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(fetched);
    });

    return () => unsubscribe();
  }, []);

  const deleteReview = async (id: string) => {
    await deleteDoc(doc(db, "reviews", id));
    toast.success("Review deleted");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-4 md:p-8 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center text-violet-600 mb-6">
        User Feedback & Reviews
      </h1>

      {/* Star Chart */}
      <div className="flex justify-center mb-10">
        <StarSummaryChart />
      </div>

      {/* Reviews */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((rev) => {
          const date = new Date(rev.createdAt?.seconds * 1000).toLocaleDateString();
          const initials = rev.name?.charAt(0)?.toUpperCase() || "?";

          return (
            <div
              key={rev.id}
              className="bg-violet-50 dark:bg-gray-900 p-5 rounded-2xl shadow hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-violet-600 text-white font-bold rounded-full">
                  {initials}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{rev.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{rev.review}</p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
