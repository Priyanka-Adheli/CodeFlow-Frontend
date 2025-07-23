import { useEffect } from "react";
import { useState } from "react";
import { IoCaretForwardOutline,IoCaretBackOutline } from "react-icons/io5";
import axiosClient from "../utils/axiosClient";
const Demo = () => {
  const [backendDates,setBackendDates] = useState(null);
  const [month, setMonth] = useState(new Date());

  useEffect(()=>{
    const fetchPOTDDates = async () => {
          try {
            const response = await axiosClient.get('/user/potdDates');
            console.log(response.data);

            let dates = [];
            for(const date of response.data)
            {
              console.log(date);
              dates.push(new Date(date).toISOString().split("T")[0]);
            }

            console.log(dates);
            setBackendDates(dates);
          } catch (error) {
            console.error('Error fetching solved problems:', error);
          }
        };

        fetchPOTDDates();
  },[]);
  const getDaysInMonth = () => {
    const year = month.getFullYear();
    const mon = month.getMonth();
    const firstDay = new Date(year, mon, 1).getDay();
    const lastDate = new Date(year, mon + 1, 0).getDate();

    const days = [];

    // Add empty slots for previous month
    for (let i = 0; i < firstDay; i++) days.push(null);

    // Add current month days
    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(year, mon, i));
    }

    return days;
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isHighlighted = (date) =>
    date && backendDates.includes(formatDate(date));

  const changeMonth = (offset) => {
    const y = month.getFullYear();
    const m = month.getMonth() + offset;
    setMonth(new Date(y, m, 1));
  };

  if(!backendDates)
  {
    return(
      <p className="text-2xl text-white font-bold text-center">Solve POTD to Get Calender Here!</p>
    )
  }
  return (
    <div className="ml-2 p-4 max-w-md mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button className="btn btn-xs bg-indigo-800 btn-ghost" onClick={() => changeMonth(-1)}>
          <IoCaretBackOutline className="h-4 w-4 text-white"/>
        </button>
        <h2 className="text-xl font-bold">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button className="btn btn-xs bg-indigo-800 btn-ghost" onClick={() => changeMonth(1)}>
          <IoCaretForwardOutline className="h-4 w-4 text-white"/>
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-semibold text-sm py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((date, idx) => (
          <div
            key={idx}
            className={`h-8 w-8 flex items-center justify-center mx-auto
              ${!date ? "text-gray-300" : "cursor-pointer"}
              ${isHighlighted(date)
                ? "bg-indigo-700 text-white rounded-full"
                : date
                ? "hover:bg-gray-100 rounded-full"
                : ""}
            `}
          >
            {date ? date.getDate() : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demo;