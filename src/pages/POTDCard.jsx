import React, { useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

const PotdCard = () => {
  const navigate = useNavigate();
  const [potd, setPotd] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPOTD = async () => {
      try {
        const response = await axiosClient.get("/problem/potd");
        setPotd(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPOTD();
  }, []);

  if (error || !potd) return null;

  return (
    <div className="card bg-white border border-slate-200 dark:bg-gray-800/90 dark:border-gray-700 shadow-md rounded-xl p-4 sm:p-6 mb-6 transition">
      <div className="flex items-center gap-3">
        <FaRegCalendar className="text-indigo-800 text-xl dark:text-white" />
        <div>
          <h3
            onClick={() => navigate(`/problem/${potd._id}`)}
            className="text-xl font-semibold text-indigo-700 hover:underline cursor-pointer transition dark:text-white"
          >
            {potd.title}
          </h3>
          <p className="text-sm text-indigo-600 dark:text-gray-200">
            Practice today's hand-picked challenge!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PotdCard;
