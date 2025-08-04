"use client";

import { motion } from "framer-motion";
import { Star, Trash2, Pencil, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import ReplySection from "./ReplySection";
import { toast } from "sonner";

type Review = {
  id: string;
  uid: string;
  name: string;
  rating: number;
  text: string;
};

type Props = {
  review: Review;
  adminUid: string;
  onEdit: (review: Review) => void;
  refresh: () => void;
};

export default function ReviewCard({ review, adminUid, onEdit, refresh }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.uid === adminUid;
  const isOwner = user?.uid === review.uid;

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "reviews", review.id));
      toast.success("Review deleted");
      refresh();
    } catch (err) {
      toast.error("Error deleting review");
    }
  };

  const getAvatar = () => {
    const gender = inferGender(review.name);
    const avatarUrl =
      gender === "female"
        ? `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(review.name)}`
        : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(review.name)}`;
    return avatarUrl;
  };

  const inferGender = (name: string) => {
    const femaleNames = ["grace", "mary", "jane", "linda", "victoria", "ada"];
    const first = name.split(" ")[0].toLowerCase();
    return femaleNames.includes(first) ? "female" : "male";
  };

  return (
    <motion.div
      className="bg-white dark:bg-violet-950 text-gray-800 dark:text-white p-4 rounded-2xl shadow-lg space-y-3 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        <img
          src={getAvatar()}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-violet-500"
        />
        <div>
          <div className="font-bold">{review.name}</div>
          <div className="flex gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className="text-yellow-400"
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm">{review.text}</p>

      <div className="flex gap-3 items-center text-sm text-violet-600 font-medium">
        {(isAdmin || isOwner) && (
          <>
            <button
              onClick={() => onEdit(review)}
              className="flex items-center gap-1 hover:underline"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 hover:underline"
            >
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}

        {user && (
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="flex items-center gap-1 hover:underline"
          >
            <MessageCircle size={16} /> Reply
          </button>
        )}
      </div>

      {showReply && (
        <div className="mt-3">
         <ReplySection
   reviewId={review.id}
    userId={user?.uid}
    userName={user?.displayName}
   adminUid="HE2BB7Eo0jUtQZqs7mhKqa4FM0t1"
/>
        </div>
      )}
    </motion.div>
  );
}
