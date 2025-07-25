"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Rating, RatingStar } from "flowbite-react";
import { motion } from "framer-motion";

export default function ReviewForm() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Get the current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;

    await addDoc(collection(db, "reviews"), {
      text: text.trim(),
      rating,
      name: name.trim() || "Anonymous",
      createdAt: Timestamp.now(),
      uid: currentUser?.uid || null,
    });

    setText("");
    setRating(null);
    setName("");
    router.push("/feedback");
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-100 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-violet-700 text-center"
      >
        Share Your Experience With Us ✨
      </motion.h1>

      <form
        onSubmit={handleAdd}
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
          <label className="block mb-2 text-gray-700 font-medium">
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
          placeholder="Write your review…"
          className="w-full px-4 py-2 border border-gray-300 rounded-md h-28 resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-violet-600 text-white rounded-md font-semibold hover:bg-violet-700 transition"
        >
          Submit Review
        </button>
      </form>
    </main>
  );
}

