import {
  collection,
  addDoc,
  getDocs,
  doc,
  Timestamp,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// Add a reply
export async function addReply(reviewId: string, replyData: any) {
  const repliesRef = collection(db, "reviews", reviewId, "replies");
  await addDoc(repliesRef, {
    ...replyData,
    createdAt: Timestamp.now(),
  });
}

// Get all replies for a review
export async function getReplies(reviewId: string) {
  const repliesRef = collection(db, "reviews", reviewId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Edit a reply
export async function editReply(reviewId: string, replyId: string, newText: string) {
  const replyRef = doc(db, "reviews", reviewId, "replies", replyId);
  await updateDoc(replyRef, {
    text: newText,
    edited: true,
  });
}

// Delete a reply
export async function deleteReply(reviewId: string, replyId: string) {
  const replyRef = doc(db, "reviews", reviewId, "replies", replyId);
  await deleteDoc(replyRef);
}
