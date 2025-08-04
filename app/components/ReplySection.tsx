"use client";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  reviewId: string;
  userId?: string;
  userName?: string;
  isAdmin?: boolean;
};

type Reply = {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt: Timestamp;
  edited?: boolean;
};

export default function ReplySection({
  reviewId,
  userId,
  userName,
  isAdmin = false,
}: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "reviews", reviewId, "replies"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReplies: Reply[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Reply, "id">),
      }));
      setReplies(fetchedReplies);
    });

    return () => unsubscribe();
  }, [reviewId]);

  const handleSubmit = async () => {
    if (!newReply.trim() || !userId || !userName) return;

    try {
      await addDoc(collection(db, "reviews", reviewId, "replies"), {
        uid: userId,
        name: userName,
        text: newReply.trim(),
        createdAt: Timestamp.now(),
        edited: false,
      });
      setNewReply("");
      toast.success("Reply added");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const handleEdit = async (id: string) => {
    if (!editedText.trim()) return;

    try {
      const replyRef = doc(db, "reviews", reviewId, "replies", id);
      await updateDoc(replyRef, {
        text: editedText.trim(),
        edited: true,
      });
      setEditingReplyId(null);
      toast.success("Reply updated");
    } catch (error) {
      console.error("Error updating reply:", error);
      toast.error("Failed to update reply");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId, "replies", id));
      toast.success("Reply deleted");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    }
  };

  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const canModify = userId === reply.uid || isAdmin;

        return (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold uppercase">
                {reply.name?.charAt(0) ?? "?"}
              </div>
              <div className="text-sm font-medium">{reply.name}</div>
              <div className="text-xs text-gray-400 ml-auto">
                {reply.createdAt?.toDate().toLocaleString()}
                {reply.edited && (
                  <span className="ml-1 text-blue-500">(edited)</span>
                )}
              </div>
            </div>

            {editingReplyId === reply.id ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-zinc-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(reply.id)}
                    className="text-sm bg-violet-600 text-white px-3 py-1 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {reply.text}
              </p>
            )}

            {canModify && editingReplyId !== reply.id && (
              <div className="flex gap-3 mt-2 text-sm text-gray-500">
                <button
                  onClick={() => {
                    setEditingReplyId(reply.id);
                    setEditedText(reply.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(reply.id)}>Delete</button>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Reply input */}
      {userId && userName && (
        <div className="flex flex-col mt-4 gap-2">
          <textarea
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-900"
          />
          <button
            onClick={handleSubmit}
            className="self-end bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-md text-sm"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}
