"use client";

import { db, auth } from "./lib/firebase";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rating, RatingStar, Avatar } from "flowbite-react";


import { motion } from "framer-motion";

// Types
type Review = {
  id: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
  name?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setReviews(snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Review, "id">),
      })));
    });
    return unsubscribe;
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating.");

    await addDoc(collection(db, "reviews"), {
      text,
      rating,
      name: name || "Anonymous",
      createdAt: Timestamp.now(),
    });

    // Clear form
    setText("");
    setRating(null);
    setName("");

    toast.success("Review submitted!");
    router.push("/reviews");
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
      <Toaster />

      <h1 className="text-3xl font-bold mb-6">User Reviews</h1>

      <form
        onSubmit={handleAdd}
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-violet-500"
        />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Your Rating:</label>
          <Rating>
            {[1, 2, 3, 4, 5].map(n => (
              <RatingStar
                key={n}
                filled={rating !== null && n <= rating}
                onClick={() => setRating(n)}
              />
            ))}
          </Rating>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          placeholder="Write your review…"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-500 h-24 resize-none mb-4"
        />

        <button
          type="submit"
          className="w-full px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
        >
          Submit Review
        </button>
      </form>

      <section className="w-full max-w-xl space-y-6">
        {reviews.map(r => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={r.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Avatar
                  placeholderInitials={(r.name || "A")[0]}
                  rounded
                  size="md"
                />
                <div>
                  <p className="font-semibold">{r.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">
                    {r.createdAt.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Rating size="sm">
                {[...Array(5).keys()].map(i => (
                  <RatingStar key={i} filled={i < r.rating} />
                ))}
              </Rating>
            </div>
            <p className="text-gray-700">{r.text}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

