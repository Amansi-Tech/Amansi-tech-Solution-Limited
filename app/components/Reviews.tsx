"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Rating, RatingStar } from "flowbite-react";
import { motion } from "framer-motion";

export default function ReviewForm() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;

    if (!currentUser) {
      alert("Please sign in with Google to submit a review.");
      return;
    }

    const reviewData = {
      text: text.trim(),
      rating,
      name: currentUser.displayName || name.trim() || "Anonymous",
      createdAt: Timestamp.now(),
      uid: currentUser.uid,
    };

    if (editingReviewId) {
      await updateDoc(doc(db, "reviews", editingReviewId), reviewData);
    } else {
      await addDoc(collection(db, "reviews"), reviewData);
    }

    setText("");
    setRating(null);
    setName("");
    setEditingReviewId(null);

    setTimeout(() => {
      router.push("/reviews");
    }, 100);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Google Sign-In failed. Check console for details.");
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-100 flex flex-col items-center text-black">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-violet-700 text-center"
      >
        Share Your Experience With Us ✨
      </motion.h1>

      {!currentUser ? (
        <button
          onClick={handleGoogleSignIn}
          className="w-full max-w-xl py-2 mb-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-semibold"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="text-center text-sm text-gray-600 mb-4">
          Logged in as{" "}
          <span className="font-semibold">{currentUser.displayName}</span>
          <button
            onClick={handleGoogleSignOut}
            className="ml-4 text-red-500 underline text-sm"
          >
            Sign out
          </button>
        </div>
      )}

      <form
        onSubmit={handleAddOrUpdate}
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
          placeholder="Write your review…"
          className="w-full px-4 py-2 border border-gray-300 rounded-md h-28 resize-none text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-violet-600 text-white rounded-md font-semibold hover:bg-violet-700 transition"
        >
          {editingReviewId ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </main>
  );
}
