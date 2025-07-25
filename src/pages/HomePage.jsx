import React from "react";
import { BsStars } from "react-icons/bs";
import Editor from "@monaco-editor/react";
import {motion} from "framer-motion";
import {
  FaTasks,
  FaRandom,
  FaRobot,
  FaCalendarDay,
  FaTrophy,
  FaFire,
} from "react-icons/fa";
import "./homepage.css";

const bgClasses = [
  "bg-indigo-500", "bg-indigo-600","bg-indigo-700", "bg-indigo-800","bg-indigo-900","bg-indigo-800","bg-indigo-700","bg-indigo-600", "bg-indigo-500"
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};
  const features = [
    {
      title: "Problems",
      desc: "Curated coding challenges based on the latest interview trends.",
      icon: <FaTasks className="text-indigo-600 text-2xl" />,
    },
    {
      title: "Time and Space Complexity",
      desc: "Explore detailed analysis for optimal code efficiency.",
      icon: <FaRandom className="text-indigo-600 text-2xl" />,
    },
    {
      title: "AI Interview",
      desc: "Simulated AI-powered mock interviews for real-world prep.",
      icon: <FaRobot className="text-indigo-600 text-2xl" />,
    },
    {
      title: "POTD",
      desc: "Daily challenges to keep your momentum and skills sharp.",
      icon: <FaCalendarDay className="text-indigo-600 text-2xl" />,
    },
    {
      title: "Leaderboard",
      desc: "See where you stand and rise through the coding ranks.",
      icon: <FaTrophy className="text-indigo-500 text-2xl" />,
    },
    {
      title: "Streaks",
      desc: "Keep consistency and earn badges as you grow daily.",
      icon: <FaFire className="text-indigo-500 text-2xl" />,
    },
  ];
  const starterCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

function Home() {
return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-16 min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900"
  >
    {/* Hero Section */}
    <section className="py-16 px-4 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-full flex justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-sm bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold mb-6 border rounded-full w-fit px-8 py-1 flex items-center gap-2 shadow-sm dark:border-gray-800">
              <BsStars className="h-5 w-5" />
              AI Powered Platform
            </h1>
          </motion.div>
          
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-800 text-transparent bg-clip-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to CodeFlow
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 mt-2 max-w-xl mx-auto dark:text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Master algorithms with our intelligent coding platform
          </motion.p>
        </motion.header>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto overflow-hidden rounded-xl dark:shadow-gray-800/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
 {features.map((item, idx) => {
              const isLastRow = idx >= features.length - 3;
              const isLastCol = (idx + 1) % 3 === 0;

              return (
                <div
                  key={idx}
                 className={`group relative p-6 flex flex-col items-center text-center
  bg-white/50 hover:bg-gradient-to-b hover:from-white/70 hover:to-white/90 transition
  dark:bg-gray-900 dark:hover:bg-none dark:hover:from-transparent dark:hover:to-transparent
  ${!isLastRow ? "border-b border-indigo-200 dark:border-gray-200" : ""}
  ${!isLastCol ? "border-r border-indigo-200 dark:border-gray-200" : ""}
  rounded-md backdrop-blur`}

                >
                  <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-2xl group-hover:scale-105 transition text-indigo-700">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-50">{item.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>
              );
            })}
        </motion.div>
      </div>
    </section>

    {/* Trending Problems */}
    <section className="w-full max-w-6xl mx-auto mt-20 px-4">
      <motion.h2 
        className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-indigo-600 dark:text-indigo-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Trending Problem Tags
      </motion.h2>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          "Dynamic Programming", 
          "Graph Theory",
          "Greedy Algorithms",
          "Binary Search",
          "Stacks & Queues",
          "Backtracking",
          "Recursion",
          "Tree Traversal"
        ].map((tag, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${bgClasses[index]} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-center cursor-pointer`}
          >
            {tag}
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Editor Section */}
    <section className="w-full max-w-6xl mt-20 px-4 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text">
          Practice with Live Editor
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto dark:text-gray-300">
          Our built-in editor supports real-time execution.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Two Sum</h3>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-300">
                  Easy
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full dark:bg-indigo-900/30 dark:text-indigo-300">
                  Array
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              Given an array of integers <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">nums</code> and an integer <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">target</code>, return indices of the two numbers such that they add up to target.
            </p>
            
            <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Example:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Input: nums = [2,7,11,15], target = 9<br />
                Output: [0,1]
              </p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold dark:text-white">Code Editor</h3>
                <select className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-white border-0 rounded px-2 py-1">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                </select>
              </div>
              <Editor
                height="350px"
                defaultLanguage="javascript"
                defaultValue={`function twoSum(nums, target) {\n  // Your code here\n}`}
                theme="vs-dark"
                options={{ 
                  fontSize: 14,
                  minimap: { enabled: false },
                  padding: { top: 10 }
                }}
                className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-inner"
              />
              <div className="flex justify-center items-center">
              <button className="mt-4 mr-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors">
                Run Code
              </button>
              <button className="mt-4 bg-white border border-indigo-600 hover:border-indigo-700 font-medium py-2 px-4 rounded transition-colors dark:text-white text-black">
                Submit Code
              </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
    <footer className="w-full bg-indigo-700 text-white p-2 mt-20 bottom-0">
  <div className="container mx-auto px-4 text-center">
    <p className="text-sm md:text-base font-semibold">
      Made with <span className="text-red-400">♥</span> by CodeFlow
    </p>
  </div>
</footer>
  </motion.div>
  
);
}

export default Home;
