"use client";
import { useState } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<string[]>([]);
  const [text, setText] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setReviews(prev => [...prev, text]);
    setText("");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">User Reviews</h1>

      <form onSubmit={handleAdd} className="mb-6 w-full max-w-lg">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your review..."
          required
          className="w-full border rounded p-2 h-24"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-violet-600 text-white rounded"
        >
          Add Review
        </button>
      </form>

      <div className="w-full max-w-lg space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            {r}
          </div>
        ))}
      </div>

      <a href="/" className="mt-6 text-violet-600 hover:underline">
        ← Back Home
      </a>
    </main>
  );
}
