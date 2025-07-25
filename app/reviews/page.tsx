
// app/reviews/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Rating, RatingStar, Avatar } from "flowbite-react";

interface Review {
  id: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
  name?: string;
  uid?: string;
}

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setReviews(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Review, "id">),
        }))
      );
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-violet-700 text-center">
        What Users Are Saying 💬
      </h1>

      <div className="w-full max-w-4xl space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div
              key={r.id}
              className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    placeholderInitials={(r.name || "A")[0]}
                    rounded
                    size="md"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{r.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">
                      {r.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Rating size="sm">
                  {[...Array(5)].map((_, i) => (
                    <RatingStar key={i} filled={i < r.rating} />
                  ))}
                </Rating>
              </div>

              <p className="text-gray-700 text-base">{r.text}</p>

              {currentUser?.uid === r.uid && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}



