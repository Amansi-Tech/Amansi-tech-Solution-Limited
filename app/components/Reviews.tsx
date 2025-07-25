"use client";

import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rating, RatingStar } from "flowbite-react";
import { motion } from "framer-motion";

export default function ReviewForm() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Get the current logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    await addDoc(collection(db, "reviews"), {
      text,
      rating,
      name: name || "Anonymous",
      createdAt: Timestamp.now(),
      uid: currentUser?.uid || null, // 🔐 Save user's UID if logged in
    });

    setText("");
    setRating(null);
    setName("");

    router.push("/feedback");
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-violet-700 text-center"
      >
        Share Your Experience With Us
      </motion.h1>

      <form
        onSubmit={handleAdd}
        className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg mb-10 space-y-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Your Rating:
          </label>
          <Rating>
            {[1, 2, 3, 4, 5].map((n) => (
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
          onChange={(e) => setText(e.target.value)}
          required
          placeholder="Write your review…"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 h-28 resize-none text-gray-700"
        />

        <button
          type="submit"
          className="w-full py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition font-semibold"
        >
          Submit Review
        </button>
      </form>
    </main>
  );
}

      </form>
    </main>
  );
}
