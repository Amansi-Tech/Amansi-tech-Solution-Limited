"use client";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Pencil, CornerDownRight } from "lucide-react";

type Reply = {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt: any;
  parentId: string | null;
  edited?: boolean;
  photoURL?: string | null;
};

type ReplySectionProps = {
  reviewId: string;
  currentUser: {
    uid: string;
    displayName: string | null;
    photoURL?: string | null;
    email?: string | null;
  } | null;
};

export default function ReplySection({ reviewId, currentUser }: ReplySectionProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "reviews", reviewId, "replies"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reply[];
        setReplies(data.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
      }
    );
    return () => unsub();
  }, [reviewId]);

  const handleReply = async () => {
    if (!currentUser || !replyText.trim()) return;

    await addDoc(collection(db, "reviews", reviewId, "replies"), {
      uid: currentUser.uid,
      name: currentUser.displayName || "Anonymous",
      text: replyText,
      createdAt: Timestamp.now(),
      parentId: parentId || null,
      edited: false,
      photoURL: currentUser.photoURL || null,
    });

    setReplyText("");
    setParentId(null);
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;

    await updateDoc(doc(db, "reviews", reviewId, "replies", id), {
      text: editText,
      edited: true,
    });

    setEditingReplyId(null);
    setEditText("");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "reviews", reviewId, "replies", id));
  };

  const renderReplies = (parent: string | null = null, depth = 0) => {
    return replies
      .filter((r) => r.parentId === parent)
      .map((reply) => (
        <motion.div
          key={reply.id}
          className={`pl-${depth * 6} py-2 border-l-2 border-zinc-300 dark:border-zinc-700`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <img
              src={
                reply.photoURL
                  ? reply.photoURL
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      reply.name
                    )}`
              }
              alt="avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{reply.name}</span>
            {reply.edited && (
              <span className="text-xs text-gray-500 ml-2">(edited)</span>
            )}
          </div>

          {editingReplyId === reply.id ? (
            <div className="space-y-2 mt-2">
              <textarea
                className="w-full p-2 border rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(reply.id)}
                  className="bg-green-500 px-3 py-1 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingReplyId(null);
                    setEditText("");
                  }}
                  className="bg-gray-500 px-3 py-1 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="ml-8 mt-1">{reply.text}</p>
          )}

          {currentUser && (
            <div className="flex gap-3 mt-1 ml-8 text-sm text-blue-600">
              <button
                onClick={() => setParentId(reply.id)}
                className="flex items-center gap-1"
              >
                <CornerDownRight size={14} />
                Reply
              </button>
              {(reply.uid === currentUser.uid ||
                currentUser.email === "p.star.chinedu@gmail.com") && (
                <>
                  <button
                    onClick={() => {
                      setEditingReplyId(reply.id);
                      setEditText(reply.text);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reply.id)}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Trash size={14} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {renderReplies(reply.id, depth + 1)}
        </motion.div>
      ));
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Replies</h4>
      {currentUser ? (
        <div className="space-y-2 mb-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "Reply to this review..."}
            className="w-full border p-2 rounded text-black dark:text-white bg-white dark:bg-zinc-800"
          />
          <button
            onClick={handleReply}
            className="bg-violet-600 text-white px-4 py-1 rounded hover:bg-violet-700"
          >
            Post
          </button>
          {parentId && (
            <button
              onClick={() => setParentId(null)}
              className="ml-2 text-sm text-gray-500"
            >
              Cancel reply
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Sign in to reply.</p>
      )}
      <div>{renderReplies()}</div>
    </div>
  );
}
