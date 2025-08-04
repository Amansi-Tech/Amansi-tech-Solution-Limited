"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { COLLECTIONS, TOAST_MESSAGES } from "../../lib/contants";

interface Reply {
  id: string;
  text: string;
  name: string;
  uid: string;
  createdAt: any;
  parentId?: string;
  edited?: boolean;
}

interface Props {
  reviewId: string;
  userId?: string;
  userName?: string;
  isAdmin: boolean;
}

export default function ReplySection({ reviewId, userId, userName, isAdmin }: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS, reviewId, COLLECTIONS.REPLIES),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReplies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reply[];
      setReplies(fetchedReplies);
    });
    return () => unsubscribe();
  }, [reviewId]);

  const handleReply = async () => {
    if (!userId || !userName || !replyText.trim()) return;
    try {
      await addDoc(collection(db, COLLECTIONS.REVIEWS, reviewId, COLLECTIONS.REPLIES), {
        text: replyText,
        name: userName,
        uid: userId,
        createdAt: serverTimestamp(),
        parentId: parentId ?? null,
      });
      setReplyText("");
      setParentId(null);
      toast.success(TOAST_MESSAGES.REPLY_ADDED);
    } catch {
      toast.error(TOAST_MESSAGES.ERROR);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this reply?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId, COLLECTIONS.REPLIES, id));
      toast.success(TOAST_MESSAGES.REPLY_DELETED);
    } catch {
      toast.error(TOAST_MESSAGES.ERROR);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingText.trim()) return;
    try {
      await updateDoc(doc(db, COLLECTIONS.REVIEWS, reviewId, COLLECTIONS.REPLIES, id), {
        text: editingText,
        edited: true,
      });
      toast.success(TOAST_MESSAGES.REPLY_UPDATED);
      setEditingId(null);
      setEditingText("");
    } catch {
      toast.error(TOAST_MESSAGES.ERROR);
    }
  };

  const renderReplies = (parentId: string | null = null, depth = 0) => {
    return replies
      .filter((reply) => reply.parentId === parentId)
      .map((reply) => (
        <div
          key={reply.id}
          className={`ml-${depth * 4} mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg`}
        >
          <p className="text-sm font-semibold">{reply.name}</p>
          {editingId === reply.id ? (
            <div className="space-y-2">
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full p-2 text-sm rounded border dark:bg-gray-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(reply.id)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 text-xs hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{reply.text}</p>
              <p className="text-xs text-gray-500">
                {reply.createdAt?.toDate().toLocaleString()}
                {reply.edited && (
                  <span className="text-yellow-500 italic ml-2">(edited)</span>
                )}
              </p>
              <div className="flex gap-2 text-xs mt-1">
                <button
                  onClick={() => {
                    setParentId(reply.id);
                    setReplyText(`@${reply.name} `);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Reply
                </button>
                {(userId === reply.uid || isAdmin) && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(reply.id);
                        setEditingText(reply.text);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reply.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Nested Replies */}
          {renderReplies(reply.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-sm mb-2">
        Replies ({replies.length})
      </h4>

      {userId && (
        <div className="mb-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 text-sm rounded border dark:bg-gray-900"
          />
          <button
            onClick={handleReply}
            className="mt-1 bg-primary text-white px-3 py-1 text-sm rounded"
          >
            Post Reply
          </button>
        </div>
      )}

      <AnimatePresence>{renderReplies()}</AnimatePresence>
    </div>
  );
}
