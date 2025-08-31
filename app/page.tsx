import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import Guest from "./components/Guest";
import AddNewRecord from "./components/AddNewRecord";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }

  return (
    <main className="font-sans bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      {/* Hero Section (like About page) */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-8 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          Welcome Back, {user.firstName} 👋
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl">
          Track your sleep and gain insights into your daily habits 🌙
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6 transition">
            {/* User Image */}
            <img
              src={user.imageUrl}
              alt={`${user.firstName}'s profile`}
              className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 shadow-md object-cover"
            />

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
                {user.firstName}'s Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Here’s a quick overview of your recent sleep activity.
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

          {/* Add Sleep Record */}
          <AddNewRecord />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p className="text-center">
              📊 Your sleep insights & analytics will appear here soon!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
