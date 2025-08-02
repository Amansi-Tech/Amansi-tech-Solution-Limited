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
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ADMIN_UID = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

export default function AdminVisitorsPage() {
  const [user, setUser] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [filter, setFilter] = useState("today");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVisitors = async () => {
      let startDate: Date;
      const now = new Date();

      if (filter === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filter === "week") {
        startDate = new Date();
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date(2020, 0, 1); // get all
      }

      const q = query(
        collection(db, "visitors"),
        where("timestamp", ">=", Timestamp.fromDate(startDate))
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setVisitors(data);
    };
    fetchVisitors();
  }, [filter]);

  const chartData = visitors.reduce((acc: any, visitor) => {
    const date = visitor.timestamp.toDate().toLocaleDateString();
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Visitor Logs</h1>

      <div className="flex gap-2">
        <Button variant={filter === "today" ? "default" : "outline"} onClick={() => setFilter("today")}>Today</Button>
        <Button variant={filter === "week" ? "default" : "outline"} onClick={() => setFilter("week")}>This Week</Button>
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid gap-4">
        {visitors.map((visitor, i) => (
          <Card key={i} className="bg-white text-black">
            <CardContent className="p-4">
              <p><strong>IP:</strong> {visitor.ip}</p>
              <p><strong>User Agent:</strong> {visitor.userAgent}</p>
              <p><strong>Time:</strong> {visitor.timestamp.toDate().toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}