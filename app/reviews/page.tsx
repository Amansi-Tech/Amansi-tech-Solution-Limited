
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { Rating, RatingStar } from "flowbite-react";
import { motion } from "framer-motion";

export default function EditReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch review and check access
  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchReview = async () => {
      try {
        const reviewRef = doc(db, "reviews", id as string);
        const reviewSnap = await getDoc(reviewRef);

        if (!reviewSnap.exists()) {
          setError("Review not found.");
          return;
        }

        const review = reviewSnap.data();

        if (review.uid !== currentUser.uid) {
          setError("Unauthorized access.");
          return;
        }

        setText(review.text);
        setRating(review.rating);
        setName(review.name || "");
      } catch (err) {
        setError("Something went wrong while loading review.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;

    try {
      await updateDoc(doc(db, "reviews", id as string), {
        text: text.trim(),
        rating,
        name: name.trim() || "Anonymous",
        updatedAt: Timestamp.now(),
      });
      router.push("/reviews");
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium">{error}</p>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-100 flex flex-col items-center text-black">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-violet-700 text-center"
      >
        ✏️ Edit Your Review
      </motion.h1>

      <form
        onSubmit={handleUpdate}
        className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg space-y-5"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div>
          <label className="block mb-2 text-black font-medium">
            Your Rating:
          </label>
          <Rating>
            {[1, 2, 3, 4, 5].map((n) => (
              <RatingStar
                key={n}
                filled={rating !== null && n <= rating}
                onClick={() => setRating(n)}
                className="cursor-pointer"
              />
            ))}
          </Rating>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          placeholder="Update your review…"
          className="w-full px-4 py-2 border border-gray-300 rounded-md h-28 resize-none text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-violet-600 text-white rounded-md font-semibold hover:bg-violet-700 transition"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}




