import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient"; 

const SubmissionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [problemSolvedInfo, setProblemSolvedInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblemSolvedInfo = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/submission/getAllSubmissions");
        console.log(response.data);
        setProblemSolvedInfo(response.data.solvedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemSolvedInfo();
  }, []);

  if (loading || !problemSolvedInfo.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-pulse space-y-6 text-center">
          <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-base-200 dark:bg-gray-900 pt-[4.5rem]">
    <div className="mx-4 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
            <tr className="text-gray-500 dark:text-gray-300 uppercase text-xs">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2 text-left">Problem</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Language</th>
              <th className="px-4 py-2">Runtime</th>
              <th className="px-4 py-2">Memory</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {problemSolvedInfo.map((problem, index) => (
              <tr key={problem.problemId ?? index} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td
                  className="px-4 py-3 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                  onClick={() => navigate(`/problem/${problem.problemId}`)}
                >
                  {problem.title}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold
                        ${problem.difficulty === 'Easy'
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                        }`}
                    >
                      {problem.difficulty}
                    </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{problem.language}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{problem.runtime}ms</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{problem.memory}KB</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.status === 'Accepted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}
                  >
                    {problem.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default SubmissionPage;
