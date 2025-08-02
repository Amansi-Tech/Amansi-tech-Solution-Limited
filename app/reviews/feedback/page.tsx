"use client";

import { useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2, Pencil, Send } from "lucide-react";
import Image from "next/image";

interface Reply {
  id?: string;
  uid: string;
  name: string;
  text: string;
  createdAt: Timestamp;
  parentId?: string;
  edited?: boolean;
  avatar?: string;
}

interface Props {
  reviewId: string;
}

export default function ReplySection({ reviewId }: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [input, setInput] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<Reply | null>(null);
  const currentUser = auth.currentUser;
  const adminUID = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

  useEffect(() => {
    const q = query(
      collection(db, "reviews", reviewId, "replies"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Reply[] = snapshot.docs.map((doc) => {
        const replyData = doc.data() as Omit<Reply, "id">;
        return {
          id: doc.id,
          ...replyData,
        };
      });
      setReplies(data);
    });

    return () => unsub();
  }, [reviewId]);

  const handleReply = async () => {
    if (!input.trim() || !currentUser) return;

   const replyData: Omit<Reply, "id"> = {
  uid: currentUser.uid,
  name: currentUser.displayName || "Anonymous",
  text: input.trim(),
  createdAt: Timestamp.now(),
  parentId: parentId ?? undefined, // fallback if null
  avatar: currentUser.photoURL || undefined,
};


    try {
      await addDoc(collection(db, "reviews", reviewId, "replies"), replyData);
      toast.success("Reply added");
      setInput("");
      setParentId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reply");
    }
  };

  const handleEdit = async () => {
    if (!editingReply || !input.trim()) return;

    try {
      const docRef = doc(db, "reviews", reviewId, "replies", editingReply.id!);
      await updateDoc(docRef, {
        text: input.trim(),
        edited: true,
      });
      toast.success("Reply updated");
      setEditingReply(null);
      setInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this reply?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId, "replies", id));
      toast.success("Reply deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const renderReplies = (parent: string | null = null, level = 0) => {
    return replies
      .filter((r) => r.parentId === parent)
      .map((reply) => (
        <motion.div
          key={reply.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`ml-${level * 4} mb-2 p-2 bg-white/5 rounded-lg`}
        >
          <div className="flex items-start gap-2">
            <Image
              src={reply.avatar || "/user.png"}
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{reply.name}</p>
                <div className="flex gap-1">
                  {(reply.uid === currentUser?.uid || currentUser?.uid === adminUID) && (
                    <>
                      <button
                        onClick={() => {
                          setEditingReply(reply);
                          setInput(reply.text);
                        }}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(reply.id!)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setParentId(reply.id!)} title="Reply">
                    <Send size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm mt-1">{reply.text}</p>
              {reply.edited && (
                <span className="text-xs text-gray-400 italic">edited</span>
              )}
            </div>
          </div>
          {/* Nested Replies */}
          {renderReplies(reply.id, level + 1)}
        </motion.div>
      ));
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-bold text-white">Replies</h4>
      <div className="space-y-2 mt-2">{renderReplies()}</div>

      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            editingReply ? "Edit your reply..." : parentId ? "Replying..." : "Write a reply..."
          }
          className="w-full rounded-lg p-2 bg-black/20 text-white border border-white/10"
        />
        <button
          onClick={editingReply ? handleEdit : handleReply}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg"
        >
          {editingReply ? "Save" : "Reply"}
        </button>
      </div>

      {(parentId || editingReply) && (
        <button
          onClick={() => {
            setParentId(null);
            setEditingReply(null);
            setInput("");
          }}
          className="text-sm text-gray-400 mt-2 hover:underline"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
