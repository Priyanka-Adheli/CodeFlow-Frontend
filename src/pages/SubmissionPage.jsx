import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient"; // Adjust the path based on your setup

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
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto">loading</div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 h-screen bg-base-200 dark:bg-gray-900">
    <div className="card ml-4 mr-4 bg-white shadow-md p-4 sm:p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-gray-400 uppercase text-xs">
              <th>#</th>
              <th>Problem</th>
              <th>Level</th>
              <th>Language</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Status</th>

              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {problemSolvedInfo.map((problem, index) => (
              <tr key={problem.problemId ?? index} className="font-semibold text-gray-900">
                <td>{index + 1}</td>
                <td
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate(`/problem/${problem.problemId}`)}
                >
                  {problem.title}
                </td>
                <td>{problem.difficulty}</td>
                <td>{problem.language}</td>
                <td>{problem.runtime}ms</td>
                <td>{problem.memory}KB</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${problem.status==='Accepted'? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{problem.status}</span>
                </td>
                <td>{new Date(problem.createdAt).toLocaleDateString()}</td>
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