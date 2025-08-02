"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

export default function EditReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        toast.error("You must be logged in.");
        router.push("/reviews/feedback");
        return;
      }

      setUser(currentUser);

      const docRef = doc(db, "reviews", id as string);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        toast.error("Review not found.");
        router.push("/reviews/feedback");
        return;
      }

      const data = snapshot.data();
      if (data.uid !== currentUser.uid) {
        toast.error("You are not allowed to edit this review.");
        router.push("/reviews/feedback");
        return;
      }

      setReviewText(data.text);
      setRating(data.rating);
      setAuthorized(true);
      setLoading(false);
    });
  }, [id, router]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "reviews", id as string), {
        text: reviewText,
        rating,
        updatedAt: Timestamp.now(),
        edited: true,
      });
      toast.success("Review updated!");
      setTimeout(() => router.push("/reviews/feedback"), 1500);
    } catch (error) {
      toast.error("Failed to update review.");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!authorized) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-black">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Your Review</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          placeholder="Update your review..."
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
