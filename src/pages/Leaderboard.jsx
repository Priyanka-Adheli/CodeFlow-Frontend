import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../utils/axiosClient";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderBoardData = async () => {
      try {
        const response = await axiosClient.get("/user/leaderboard");
        setLeaderBoard(response.data.leaderBoardUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderBoardData();
  }, []);

  if (loading || !leaderboardData) {
    return (
      <div className="bg-gradient-to-br from-[#E6F2F1] to-[#F3F5F4] min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-xl px-4">
          <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

return (
    <div className="mt-16 min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Title */}
      <div className="text-center pt-20 pb-10">
        <h1 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-400">🏆 Leaderboard</h1>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-300">
          Track top performers based on problem solving activity
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
        {leaderboardData.slice(0, 3).map((user, i) => (
          <motion.div
            key={user.rank}
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.03 }}
            className={`
              relative bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 
              shadow-lg rounded-xl text-center p-8 overflow-hidden
              ${i === 0 ? 'shadow-yellow-400/20 dark:shadow-yellow-600/20' : 
                i === 1 ? 'shadow-gray-400/20 dark:shadow-gray-600/20' : 
                'shadow-amber-600/20 dark:shadow-amber-700/20'}
            `}
          >
            {/* Metallic strip */}
            <div className={`
              absolute top-0 left-0 w-2 h-full
              ${i === 0 ? 'bg-gradient-to-b from-yellow-400 to-yellow-300 dark:from-yellow-500 dark:to-yellow-400' : 
                i === 1 ? 'bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-400 dark:to-gray-300' : 
                'bg-gradient-to-b from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500'}
            `}></div>
            
            {/* Medal indicator */}
            <div className={`
              absolute -top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center
              ${i === 0 ? 'bg-yellow-400 dark:bg-yellow-500 shadow-lg shadow-yellow-400/30 dark:shadow-yellow-600/30' : 
                i === 1 ? 'bg-gray-300 dark:bg-gray-400 shadow-lg shadow-gray-400/30 dark:shadow-gray-600/30' : 
                'bg-amber-500 dark:bg-amber-600 shadow-lg shadow-amber-500/30 dark:shadow-amber-700/30'}
            `}>
              <span className="text-2xl">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>

            <div className="mt-4 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Problems Solved: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.problemSolved}</span>
              </p>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                🔥 Streak: {user.currentStreak} / Max: {user.MaxStreak}
              </p>
            </div>

            {/* Decorative elements */}
            {i === 0 && (
              <div className="absolute bottom-2 right-2 text-yellow-400 dark:text-yellow-500 text-4xl opacity-20">★</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="overflow-x-auto max-w-6xl mx-auto px-4 mb-20"
      >
        <div className="bg-white dark:bg-gray-800 border border-[#088395]/20 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden transition-colors duration-300">
          <table className="min-w-full text-sm">
            <thead className="text-sm font-semibold">
              <tr className="bg-indigo-50 dark:bg-gray-700 border-b border-indigo-200 dark:border-gray-600 text-indigo-700 dark:text-indigo-300 text-center">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Problems Solved</th>
                <th className="py-4 px-6">🔥 Streak</th>
                <th className="py-4 px-6">Max Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, idx) => (
                <motion.tr
                  key={user.rank}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className={`
                    border-b border-gray-100 dark:border-gray-700 font-medium text-center
                    ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-800/70'}
                  `}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      {idx === 0 && <span className="mr-2">🥇</span>}
                      {idx === 1 && <span className="mr-2">🥈</span>}
                      {idx === 2 && <span className="mr-2">🥉</span>}
                      {user.rank}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                        <span className="text-sm">👤</span>
                      </div>
                      <div>
                        <div className="text-gray-800 dark:text-gray-100">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo-600 dark:text-indigo-400">
                    {user.problemSolved}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
                      🔥 {user.currentStreak}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {user.MaxStreak}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
