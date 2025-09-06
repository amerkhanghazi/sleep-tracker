"use client";

import React from "react";

interface Record {
  date: string ;
  weight: number;
}

interface HighlightsProps {
  records: Record[];
}

const Highlights: React.FC<HighlightsProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg py-auto text-center my-auto">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
        No Records Yet
      </h3>
        <p className=" px-6 text-xs text-gray-600 dark:text-gray-300">
          Start logging your workouts to see highlights here!
        </p>
      </div>
    );
  }

  const totalWorkouts = records.length;
  const currentWeight = records[records.length - 1].weight;

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const workoutDaysThisMonth = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const attendance = Math.round((workoutDaysThisMonth / daysInMonth) * 100);

   return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
        {monthName} Highlights
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Current Weight: <span className="font-bold">{currentWeight} kg</span>
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Attendance this month: <span className="font-bold">{attendance}%</span>
      </p>
    </div>
  );
};

export default Highlights;
