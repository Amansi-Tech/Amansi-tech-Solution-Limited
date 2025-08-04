"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ReviewData {
  id?: string;
  uid: string;
  name: string;
  rating: number;
  review: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export default function ReviewForm() {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  // Prevent navigation if form is incomplete
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (rating === 0 || review.trim() === "") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [rating, review]);

  // Detect logged-in user and existing review
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const q = query(
          collection(db, "reviews"),
          where("uid", "==", currentUser.uid)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = doc.data() as ReviewData;
            setExistingReviewId(doc.id);
            setRating(data.rating);
            setReview(data.review);
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReviewId) {
        // Update existing review
        await updateDoc(doc(db, "reviews", existingReviewId), {
          rating,
          review,
          updatedAt: Timestamp.now(),
        });
        toast.success("Your review was updated successfully!");
      } else {
        // Add new review
        await addDoc(collection(db, "reviews"), {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          rating,
          review,
          createdAt: Timestamp.now(),
        });
        toast.success("Review submitted successfully!");
      }

      router.push("/reviews/feedback");
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#111] shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-violet-600 mb-4 text-center">
        {existingReviewId ? "Update Your Review" : "Leave a Review"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-violet-700 font-semibold mb-2">
            Star Rating:
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review textarea */}
        <div>
          <label className="block text-violet-700 font-semibold mb-2">
            Your Review:
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write something great..."
            className="w-full h-32 p-3 rounded-lg border border-violet-300 focus:ring-2 focus:ring-violet-500 focus:outline-none dark:bg-neutral-900 dark:text-white"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-semibold w-full transition duration-200"
        >
          {isSubmitting
            ? existingReviewId
              ? "Updating..."
              : "Submitting..."
            : existingReviewId
            ? "Update Review"
            : "Submit Review"}
        </button>
      </form>
    </motion.div>
  );
}

