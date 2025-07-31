"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rating, RatingStar } from "flowbite-react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { toast } from "sonner";

import { ShieldAlert } from "lucide-react";

export default function ReviewFormPage() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showMfaAlert, setShowMfaAlert] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) setShowMfaAlert(true);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in with Google to submit a review.");
      return;
    }
    if (!rating || !text.trim()) return;

    try {
      await addDoc(collection(db, "reviews"), {
        text: text.trim(),
        rating,
        name: currentUser.displayName || name.trim() || "Anonymous",
        createdAt: Timestamp.now(),
        uid: currentUser.uid,
      });

      setText("");
      setRating(null);
      setName("");

      toast.success("🎉 Review submitted!");
      router.push("/reviews");
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully.");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
      toast.error(`Sign-in failed: ${error.message}`);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out.");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Error signing out.");
    }
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gray-100 dark:bg-gray-950 flex flex-col items-center text-black dark:text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-4xl font-bold mb-6 text-violet-700 dark:text-violet-400 text-center"
      >
        Share Your Experience With Us ✨
      </motion.h1>

      {!currentUser ? (
        <button
          onClick={handleGoogleSignIn}
          className="w-full max-w-md py-2 mb-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-semibold"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
          Logged in as{" "}
          <span className="font-semibold">{currentUser.displayName}</span>
          <button
            onClick={handleGoogleSignOut}
            className="ml-4 text-red-500 underline text-sm"
          >
            Sign out
          </button>

         {showMfaAlert && (
  <div className="relative max-w-md w-full mx-auto mt-4 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-md">
    <div className="flex items-start space-x-3">
      <ShieldAlert className="w-5 h-5 mt-1 text-yellow-700 dark:text-yellow-300" />
      <div>
        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
          Secure Your Google Account
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          For better security, enable <strong>2-Step Verification (MFA)</strong>.{" "}
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-blue-400"
          >
            Click here to enable
          </a>
          .
        </p>
      </div>
    </div>

    <button
      onClick={() => setShowMfaAlert(false)}
      className="absolute top-2 right-3 text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100 text-lg font-bold"
      aria-label="Close alert"
    >
      ✕
    </button>
  </div>
)}

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg space-y-5"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:text-white"
        />

        <div>
          <label className="block mb-2 font-medium">Your Rating:</label>
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
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md h-28 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:text-white"
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
