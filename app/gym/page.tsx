import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import AddNewExercise from "../components/AddNewExcercise";
import GymRecordChart from "../components/GymRecordChart";
import AttendanceCalendar from "../components/AttendanceCalendar";
import Highlights from "../components/Highlights";
import getGymRecords from "../actions/getGymRecords";

const GymPage = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Please sign in to track your gym progress.
        </h2>
      </main>
    );
  }

  // ✅ Fetch gym records once
  const { records, error } = await getGymRecords();

  return (
    <main className="font-sans bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6 transition">
            <img
              src={user.imageUrl}
              alt={`${user.firstName}'s profile`}
              className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 shadow-md object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Welcome Back, {user.firstName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Let’s log your workout progress today.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Joined:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Last Active:</span>{" "}
                  {user.lastActiveAt
                    ? new Date(user.lastActiveAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Add Exercise Record */}
          <AddNewExercise />
        </div>

        {/* Right Column (Charts/Stats) */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pass fetched records as props */}
            <AttendanceCalendar records={records ?? []} />
            <Highlights records={records ?? []} />
          </div>

          <GymRecordChart records={records ?? []} />
        </div>
      </div>
    </main>
  );
};

export default GymPage;
