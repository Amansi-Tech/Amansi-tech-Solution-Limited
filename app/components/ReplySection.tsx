"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

import { db, auth } from "../../lib/firebase";
import { toast } from "sonner";
import { Avatar } from "flowbite-react";
import { motion } from "framer-motion";
import { MessageCircle, Trash2, Pencil, Save, X, CornerDownRight } from "lucide-react";

type Reply = {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt: any;
  parentId?: string;
  edited?: boolean;
};

export default function ReplySection({
  reviewId,
  reviewAuthorUid,
}: {
  reviewId: string;
  reviewAuthorUid: string;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  const currentUser = auth.currentUser;
  const adminUid = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

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
    if (!replyText.trim()) return;

    try {
      await addDoc(collection(db, "reviews", reviewId, "replies"), {
        uid: currentUser?.uid,
        name: currentUser?.displayName || "Anonymous",
        text: replyText,
        createdAt: serverTimestamp(),
        parentId: parentId || null,
        edited: false,
      });

      setReplyText("");
      setParentId(null);
      toast.success("Reply added!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId, "replies", id));
      toast.success("Reply deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete reply.");
    }
  };

  const handleEdit = (id: string, text: string) => {
    setEditingReplyId(id);
    setEditedText(text);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, "reviews", reviewId, "replies", id), {
        text: editedText,
        edited: true,
      });
      toast.success("Reply updated.");
      setEditingReplyId(null);
      setEditedText("");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update reply.");
    }
  };

  const renderReplies = (parent: string | null = null, level = 0) =>
    replies
      .filter((r) => r.parentId === parent)
      .map((reply) => (
        <motion.div
          key={reply.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`ml-${level * 4} mt-3 p-3 rounded-xl bg-gray-800/40 border border-gray-600`}
        >
          <div className="flex items-start gap-2">
            <Avatar
              img={`https://api.dicebear.com/7.x/thumbs/svg?seed=${reply.uid}`}
              rounded
              size="sm"
            />
            <div className="w-full">
              <div className="flex items-center justify-between text-sm text-gray-200">
                <span className="font-medium">{reply.name}</span>
                <span className="text-xs text-gray-400">
                  {reply.createdAt?.seconds
                    ? new Date(reply.createdAt.seconds * 1000).toLocaleString()
                    : "Just now"}
                  {reply.edited && <span className="ml-2 italic text-yellow-400">(edited)</span>}
                </span>
              </div>

              {editingReplyId === reply.id ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      onClick={() => handleSaveEdit(reply.id)}
                      className="px-3 py-1 rounded text-green-400 bg-gray-700 hover:bg-gray-600"
                    >
                      <Save className="h-4 w-4 inline mr-1" /> Save
                    </button>
                    <button
                      onClick={() => setEditingReplyId(null)}
                      className="px-3 py-1 rounded text-gray-400 bg-gray-700 hover:bg-gray-600"
                    >
                      <X className="h-4 w-4 inline mr-1" /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-100 mt-1">{reply.text}</p>
              )}

              <div className="flex gap-3 mt-2 text-xs text-gray-400">
                <button onClick={() => setParentId(reply.id)} className="hover:text-blue-400">
                  <CornerDownRight className="inline w-3 h-3 mr-1" />
                  Reply
                </button>
                {(currentUser?.uid === reply.uid || currentUser?.uid === adminUid) && (
                  <>
                    <button
                      onClick={() => handleEdit(reply.id, reply.text)}
                      className="hover:text-yellow-400"
                    >
                      <Pencil className="inline w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reply.id)}
                      className="hover:text-red-400"
                    >
                      <Trash2 className="inline w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Render nested replies */}
              {renderReplies(reply.id, level + 1)}
            </div>
          </div>
        </motion.div>
      ));

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-start gap-2">
        <Avatar
          img={`https://api.dicebear.com/7.x/thumbs/svg?seed=${currentUser?.uid || "guest"}`}
          rounded
          size="sm"
        />
        <div className="w-full">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={parentId ? "Replying to a reply..." : "Write a reply..."}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={2}
          />
          <div className="flex justify-between mt-1">
            <button
              onClick={handleReply}
              className="flex items-center px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </button>
            {parentId && (
              <button
                onClick={() => setParentId(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel replying
              </button>
            )}
          </div>
        </div>
      </div>

      <div>{renderReplies()}</div>
    </div>
  );
}
