"use client";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Trash, Pencil, MessageCircleReply } from "lucide-react";

interface Reply {
  id: string;
  uid: string;
  name: string;
  text: string;
  parentId?: string | null;
  createdAt?: any;
  edited?: boolean;
}

interface Props {
  reviewId: string;
  userId?: string;
  userName?: string;
  adminUid: string;
  isAdmin: boolean;
}

export default function ReplySection({ reviewId, userId, userName, adminUid, isAdmin }: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const repliesRef = collection(db, "reviews", reviewId, "replies");

  useEffect(() => {
    const q = query(repliesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReplies: Reply[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reply[];
      setReplies(fetchedReplies);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [reviewId]);

  useEffect(() => {
    if (parentId && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [parentId]);

  const handleReply = async () => {
    const text = replyText.trim();
    if (!userId || !userName) return toast.error("Please log in to reply.");
    if (!text) return toast.error("Reply cannot be empty.");
    if (text.length > 1000) return toast.error("Reply is too long.");

    try {
      await addDoc(repliesRef, {
        uid: userId,
        name: userName,
        text,
        parentId: parentId || null,
        createdAt: serverTimestamp(),
        edited: false,
      });
      setReplyText("");
      setParentId(null);
    } catch {
      toast.error("Failed to send reply.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(repliesRef, id));
    } catch {
      toast.error("Failed to delete reply.");
    }
  };

  const handleEdit = (id: string, text: string) => {
    setEditingReplyId(id);
    setEditingText(text);
  };

  const saveEdit = async (id: string) => {
    const newText = editingText.trim();
    if (!newText) return toast.error("Reply cannot be empty.");
    if (newText.length > 1000) return toast.error("Reply too long.");

    try {
      await updateDoc(doc(repliesRef, id), {
        text: newText,
        edited: true,
      });
      setEditingReplyId(null);
      setEditingText("");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const renderReplies = (parentId: string | null = null, depth = 0) =>
    replies
      .filter((r) => r.parentId === parentId)
      .map((reply) => {
        const children = replies.filter((r) => r.parentId === reply.id);
        const canEdit = reply.uid === userId || isAdmin;

        return (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: `${depth * 1.5}rem` }}
            className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold">
                {reply.name}{" "}
                {reply.createdAt?.toDate
                  ? `· ${reply.createdAt.toDate().toLocaleString()}`
                  : "· Sending..."}{" "}
                {reply.edited && (
                  <span className="text-xs text-yellow-600">(edited)</span>
                )}
              </div>
              <div className="flex gap-2">
                {canEdit && (
                  <>
                    <button
                      onClick={() => handleEdit(reply.id, reply.text)}
                      className="text-blue-500 hover:underline"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(reply.id)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash size={14} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setParentId(reply.id)}
                  className="text-green-600"
                  title="Reply"
                >
                  <MessageCircleReply size={14} />
                </button>
              </div>
            </div>

            {editingReplyId === reply.id ? (
              <div className="mt-2">
                <textarea
                  className="w-full p-1 rounded border dark:bg-black"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => saveEdit(reply.id)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="text-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm">{reply.text}</p>
            )}

            {children.length > 0 && (
              <div className="mt-2 ml-2 text-xs text-gray-500">
                {children.length} repl{children.length > 1 ? "ies" : "y"}
              </div>
            )}

            {renderReplies(reply.id, depth + 1)}
          </motion.div>
        );
      });

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Replies</h4>

      {loading ? (
        <p className="text-sm text-gray-500">Loading replies...</p>
      ) : (
        <AnimatePresence>{renderReplies()}</AnimatePresence>
      )}

      <div className="mt-4">
        <textarea
          ref={replyInputRef}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={parentId ? "Replying..." : "Write a reply..."}
          className="w-full p-2 border rounded dark:bg-black"
        />
        <button
          onClick={handleReply}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
        {parentId && (
          <button
            onClick={() => setParentId(null)}
            className="ml-2 mt-2 px-3 py-1 text-sm text-gray-600 hover:underline"
          >
            Cancel reply
          </button>
        )}
      </div>
    </div>
  );
}
