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
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

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

  // Handle auth state
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
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Warn before leaving if unsaved
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

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReviewId) {
        await updateDoc(doc(db, "reviews", existingReviewId), {
          rating,
          review,
          updatedAt: Timestamp.now(),
        });
        toast.success("Your review was updated successfully!");
      } else {
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

  if (!user) {
    return (
      <motion.div
        className="max-w-xl mx-auto p-8 text-center bg-white dark:bg-[#111] shadow-xl rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-violet-600 mb-6">
          Sign in to leave a review
        </h2>
        <button
          onClick={handleSignIn}
          className="flex items-center gap-3 justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-lg w-full font-semibold shadow transition"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#111] shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-violet-600">
          {existingReviewId ? "Update Your Review" : "Leave a Review"}
        </h2>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
