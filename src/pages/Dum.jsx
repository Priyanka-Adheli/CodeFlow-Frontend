import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
export default function Dum() {
  return (
    <div className="mt-16 min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white space-y-6 transition-all duration-300">
      <header className="p-4 flex justify-end border-b border-gray-300 dark:border-gray-700">
        <ThemeToggle />
      </header>
      <h1 className="text-3xl font-bold">Dark Mode Demo</h1>

      <div className="w-80 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Theme Preview</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This card updates with the theme. Try toggling!
        </p>
      </div>

      <input
        type="text"
        placeholder="Type something..."
        className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
}