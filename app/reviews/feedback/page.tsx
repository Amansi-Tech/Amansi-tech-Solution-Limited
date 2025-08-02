"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import StarSummaryChart from "../../components/StarSummaryChart";
import ExportCSVButton from "../../components/ExportCSVButton";
import ReplySection from "../../components/ReplySection";
import { motion } from "framer-motion";

interface Review {
  id: string;
  uid: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  createdAt: any;
  photoURL?: string;
}

const ADMIN_UID = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const snapshot = await getDocs(
        query(collection(db, "reviews"), orderBy("createdAt", "desc"))
      );
      const data: Review[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesStars = filterStars ? r.rating === filterStars : true;
    const matchesSearch = r.text.toLowerCase().includes(search.toLowerCase());
    return matchesStars && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this review?");
    if (!confirm) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Admin Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStars(filterStars === s ? null : s)}
              className={`p-2 border rounded ${
                filterStars === s ? "bg-yellow-400" : ""
              }`}
            >
              {s}★
            </button>
          ))}
          <button
            onClick={() => setFilterStars(null)}
            className="text-sm underline"
          >
            Clear Filter
          </button>
        </div>
        {user?.uid === ADMIN_UID && (
          <ExportCSVButton reviews={filteredReviews} />
        )}
      </div>

      <StarSummaryChart reviews={filteredReviews} />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border p-4 rounded bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    src={
                      review.photoURL ||
                      `https://api.dicebear.com/7.x/thumbs/svg?seed=${review.uid}`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(
                        review.createdAt?.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-zinc-700 dark:text-zinc-200">
                {review.text}
              </p>

              <div className="mt-3 flex items-center space-x-4">
                {(user?.uid === review.uid || user?.uid === ADMIN_UID) && (
                  <>
                    <button
                      onClick={() =>
                        router.push(`/reviews/edit/${review.id}`)
                      }
                      className="text-blue-600 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className={`text-red-600 underline ${
                        deletingId === review.id ? "opacity-50" : ""
                      }`}
                      disabled={deletingId === review.id}
                    >
                      {deletingId === review.id ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>

              <ReplySection reviewId={review.id} currentUser={user} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
