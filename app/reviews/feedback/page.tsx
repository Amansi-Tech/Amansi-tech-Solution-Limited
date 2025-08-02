"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ReviewCard from "../../components/ReviewCard";
import StarSummaryChart from "../../components/StarSummaryChart";
import ExportCSVButton from "../../components/ExportCSVButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<"today" | "week" | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(data);
        setFilteredReviews(data);
      } catch (err) {
        toast.error("Error fetching reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    let filtered = [...reviews];

    if (selectedStars !== null) {
      filtered = filtered.filter((review) => review.stars === selectedStars);
    }

    if (selectedDate === "today") {
      filtered = filtered.filter((review) => review.createdAt?.toDate() >= oneDayAgo);
    } else if (selectedDate === "week") {
      filtered = filtered.filter((review) => review.createdAt?.toDate() >= oneWeekAgo);
    }

    if (searchTerm) {
      filtered = filtered.filter((review) =>
        review.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [selectedStars, selectedDate, searchTerm, reviews]);

  return (
    <div className="p-4 md:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">User Feedback</h1>
        <ExportCSVButton reviews={filteredReviews} />
      </div>

      <StarSummaryChart reviews={filteredReviews} />

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2">
          <button onClick={() => setSelectedStars(null)} className="px-3 py-1 rounded border">All</button>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedStars(star)}
              className={`px-3 py-1 rounded border ${selectedStars === star ? "bg-blue-500 text-white" : ""}`}
            >
              {star}★
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {["today", "week", "all"].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedDate(option as "today" | "week" | "all")}
              className={`px-3 py-1 rounded border ${selectedDate === option ? "bg-green-500 text-white" : ""}`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No reviews found.</p>
      )}
    </div>
  );
}
