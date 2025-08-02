"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ADMIN_UID = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

interface Visitor {
  ip: string;
  userAgent: string;
  timestamp: Timestamp;
}

export default function AdminVisitorsPage() {
  const [user, setUser] = useState<any>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filter, setFilter] = useState<"today" | "week" | "all">("today");
  const router = useRouter();

  // Only allow admin to access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch visitors from Firestore based on filter
  useEffect(() => {
    const fetchVisitors = async () => {
      let startDate: Date;
      const now = new Date();

      if (filter === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filter === "week") {
        const day = now.getDay(); // Sunday = 0
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date(2020, 0, 1); // All time
      }

      const q = query(
        collection(db, "visitors"),
        where("timestamp", ">=", Timestamp.fromDate(startDate))
      );
      const snapshot = await getDocs(q);

      const data: Visitor[] = snapshot.docs.map((doc: DocumentData) => {
        const d = doc.data();
        return {
          ip: d.ip || "N/A",
          userAgent: d.userAgent || "N/A",
          timestamp: d.timestamp || Timestamp.now(),
        };
      });

      setVisitors(data);
    };

    fetchVisitors();
  }, [filter]);

  // Format data for chart
  const chartData = visitors.reduce((acc: any[], visitor) => {
    const date = visitor.timestamp.toDate().toLocaleDateString();
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Visitor Logs</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(["today", "week", "all"] as const).map((label) => (
          <button
            key={label}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === label
                ? "bg-purple-600 text-white"
                : "border border-gray-300 text-gray-800"
            }`}
            onClick={() => setFilter(label)}
          >
            {label === "today"
              ? "Today"
              : label === "week"
              ? "This Week"
              : "All Time"}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[300px] bg-white p-4 rounded-md shadow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Visitor List */}
      <div className="grid gap-4">
        {visitors.length === 0 ? (
          <p className="text-gray-500">No visitor data for selected filter.</p>
        ) : (
          visitors.map((visitor, index) => (
            <Card key={index} className="bg-white text-black">
              <CardContent className="p-4 space-y-1">
                <p>
                  <strong>IP:</strong> {visitor.ip}
                </p>
                <p>
                  <strong>User Agent:</strong> {visitor.userAgent}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {visitor.timestamp.toDate().toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
