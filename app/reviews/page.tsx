"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
} from "firebase/auth";
import Link from "next/link";
import { Rating, RatingStar } from "flowbite-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all reviews
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(list);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
      console.log("Review deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete review.");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-50 text-black">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold mb-10 text-center text-violet-700"
      >
        ⭐ What People Are Saying
      </motion.h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No reviews ye.
          </p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-violet-600">
                  {review.name || "Anonymous"}
                </h3>
                <span className="text-xs text-gray-500">
                  {review.createdAt?.seconds &&
                    format(
                      new Date(review.createdAt.seconds * 1000),
                      "MMM dd, yyyy"
                    )}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <RatingStar
                    key={n}
                    filled={n <= review.rating}
                    className="text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-800">{review.text}</p>

              {currentUser && review.uid === currentUser.uid && (
                <div className="flex gap-3 justify-end text-sm">
                  <Link
                    href={`/reviews/edit/${review.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

