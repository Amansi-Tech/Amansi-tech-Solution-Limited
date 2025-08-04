"use client";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2, Pencil, Send, CornerUpRight } from "lucide-react";

type Reply = {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt: any;
  edited?: boolean;
  parentId?: string;
};

type Props = {
  reviewId: string;
  userId?: string;
  userName?: string;
  adminUid: string;
};

export default function ReplySection({ reviewId, userId, userName, adminUid }: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "reviews", reviewId, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const replyList: any = [];
      snapshot.forEach((doc) => {
        replyList.push({ id: doc.id, ...doc.data() });
      });
      setReplies(replyList);
    });
    return () => unsubscribe();
  }, [reviewId]);

  const handleReply = async () => {
    if (!newReply.trim()) return;
    if (!userId) return toast.error("You must be logged in to reply");

    try {
      await addDoc(collection(db, "reviews", reviewId, "replies"), {
        uid: userId,
        name: userName || "Anonymous",
        text: newReply,
        createdAt: serverTimestamp(),
        parentId: replyingTo || null,
      });
      setNewReply("");
      setReplyingTo(null);
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "reviews", reviewId, "replies", id), {
        text: editText,
        edited: true,
      });
      setEditingId(null);
      toast.success("Reply updated");
    } catch {
      toast.error("Failed to update reply");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId, "replies", id));
      toast.success("Reply deleted");
    } catch {
      toast.error("Failed to delete reply");
    }
  };

  const renderReplies = (parentId: string | null = null, level = 0) => {
    return replies
      .filter((r) => r.parentId === parentId)
      .map((r) => {
        const canModify = userId === r.uid || userId === adminUid;

        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-${level * 4} mb-2 p-3 rounded-xl bg-white dark:bg-violet-950 shadow`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                {r.name?.charAt(0)}
              </div>
              <div className="text-sm font-medium">{r.name}</div>
              <span className="text-xs text-gray-500 ml-2">
                {r.createdAt?.toDate?.().toLocaleString?.()}
                {r.edited && " • edited"}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-100">
              {editingId === r.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="border p-2 rounded-md"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(r.id)}
                      className="px-3 py-1 rounded bg-violet-600 text-white text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>{r.text}</p>
              )}
            </div>

            <div className="flex gap-3 mt-2 text-xs">
              {canModify && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(r.id);
                      setEditText(r.text);
                    }}
                    className="text-violet-500 flex items-center gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
              {userId && (
                <button
                  onClick={() => setReplyingTo(r.id)}
                  className="text-violet-700 flex items-center gap-1"
                >
                  <CornerUpRight size={14} /> Reply
                </button>
              )}
            </div>

            {/* Nested reply input */}
            {replyingTo === r.id && (
              <div className="mt-2 flex flex-col gap-2">
                <textarea
                  className="border p-2 rounded-md"
                  placeholder="Write your reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleReply}
                    className="px-3 py-1 rounded bg-violet-700 text-white text-sm"
                  >
                    Reply <Send size={14} className="inline ml-1" />
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 rounded bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {renderReplies(r.id, level + 1)}
          </motion.div>
        );
      });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-violet-700">Replies</h3>

      {userId && (
        <div className="mb-4">
          <textarea
            className="w-full border p-2 rounded-md"
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button
            onClick={handleReply}
            className="mt-2 px-4 py-2 bg-violet-600 text-white rounded-md"
          >
            Post Reply
          </button>
        </div>
      )}

      {renderReplies()}
    </div>
  );
}
