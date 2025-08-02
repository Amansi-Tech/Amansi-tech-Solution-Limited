"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ReviewForm() {
  const [user, setUser] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [hasTyped, setHasTyped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(
          collection(db, "reviews"),
          where("uid", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setReviewText(docData.data().text);
          setRating(docData.data().rating);
          setExistingReviewId(docData.id);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!existingReviewId && hasTyped) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [existingReviewId, hasTyped]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    if (reviewText.trim().length < 20) {
      setError("Review must be at least 20 characters.");
      return;
    }

    setError("");

    const reviewData = {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email,
      text: reviewText.trim(),
      rating,
      createdAt: Timestamp.now(),
    };

    try {
      setLoading(true);

      if (existingReviewId) {
        await updateDoc(doc(db, "reviews", existingReviewId), reviewData);
      } else {
        await addDoc(collection(db, "reviews"), reviewData);
      }

      setHasTyped(false);
      toast.success("Review submitted successfully!");

      setTimeout(() => {
        router.push("/reviews/feedback");
      }, 1000);
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReviewText("");
    setRating(5);
    setHasTyped(false);
    setError("");
  };

  if (!user) return null;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow max-w-xl mt-[2rem] mb-[2rem] space-y-4"
    >
      {/* USER INFO */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-sm text-white">
            {user.displayName?.[0] || "U"}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-zinc-800 dark:text-white">
            {user.displayName || "Anonymous"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
        </div>
      </motion.div>

      {/* REVIEW INPUT */}
      <textarea
        required
        minLength={20}
        placeholder="Write at least 20 characters..."
        value={reviewText}
        onChange={(e) => {
          setReviewText(e.target.value);
          setHasTyped(true);
          if (e.target.value.length >= 20) setError("");
        }}
        className="w-full border rounded p-2 text-black dark:text-white bg-white dark:bg-zinc-800"
      />
      {error && (
        <p className="text-red-500 text-sm -mt-2">{error}</p>
      )}

      {/* STAR RATING */}
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={28}
            onClick={() => {
              setRating(i);
              setHasTyped(true);
            }}
            className={`cursor-pointer transition-colors ${
              i <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-300">
          {rating} star{rating !== 1 && "s"}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 flex items-center justify-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Submitting...
            </>
          ) : existingReviewId ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </button>

        {/* CANCEL BUTTON */}
        {existingReviewId && !loading && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-zinc-600 hover:text-red-500"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}
