import React,{useState,useEffect} from 'react';
import CalendarHeatmap from "react-calendar-heatmap";
import { format, parseISO } from "date-fns";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import axiosClient from "../utils/axiosClient";
import {useNavigate} from "react-router";
import { logoutUser } from '../authSlice';
import { useDispatch,useSelector } from 'react-redux';
import { FaCheckDouble,FaFire,FaJava   } from "react-icons/fa";
import { BiLogoCPlusPlus } from "react-icons/bi";
import { RiJavascriptFill } from "react-icons/ri";
import { FaCode } from "react-icons/fa6";

function Dashboard() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData,setLeaderBoard] = useState(false);
  const [problemSolvedInfo,setProblemSolvedInfo] = useState(null);
  const [langUsed,setLangUsed] = useState(null);

  const {user} = useSelector((state)=>state.auth);
  let easyPercent,mediumPercent,hardPercent;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/user/getProfile");
        const heatMap = response.data.user.problemSolvingHistory.map((entry) => ({
          date: entry.date,
          count: entry.problemIds.length,
        }));
        console.log(response.data);
        setUserData(response.data.user);
        setHeatmapData(heatMap);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    setLoading(true);

    const fetchLeaderBoardData = async() =>{
        try{
        const response = await axiosClient.get("/user/leaderboard");
        setLeaderBoard(response.data.leaderBoardUsers);
        }
        catch(error)
        {
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    };

    fetchLeaderBoardData();
  },[]);

    useEffect(() => {
    const fetchProblemSolvedInfo = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/submission/getAllSubmissions");
        console.log(response.data);
        setLangUsed(response.data.mostLangUsed);
        setProblemSolvedInfo(response.data.solvedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemSolvedInfo();
  }, []);
  if (loading  || !userData ) {
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

  if(userData)
  {
    easyPercent = (userData.EasySolved /userData.problemSolved.length) *100;
    mediumPercent = (userData.MediumSolved /userData.problemSolved.length) *100;
    hardPercent = (userData.HardSolved /userData.problemSolved.length) *100;

  }
  const handleLogout =  () =>{
    dispatch(logoutUser());
  }
  const handleDelProfile = () =>{
    const delProfile = window.confirm("Are you sure you want to delete your profile?");
    if(delProfile)
    dispatch(delUser());
  }
  return (
    <div className="mt-16 bg-base-200 text-gray-800 font-sans min-h-screen flex flex-col lg:flex-row dark:bg-gray-900 transition duration-300">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-full lg:w-72 shrink-0 p-4 lg:p-6">
        <div className="h-full bg-indigo-700 text-white p-6 shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-white mb-10">CodeFlow</h1>
          <nav className="flex flex-col gap-3">
            <p className='text-md font-bold'>{userData.firstName}</p>
            <p className='text-sm font-bold'>{userData.email}</p>
            {
              user?.role=="admin" &&(
           <button className='btn bg-white transition-transform duration-300 ease-in-out hover:scale-120' onClick={()=>navigate('/admin')}>Admin Actions</button>
              )
            }
           <button className='btn bg-white transition-transform duration-300 ease-in-out hover:scale-120' onClick={()=> setShowEditProfile(true)}>Edit Profile</button>
           <button className='btn bg-white transition-transform duration-300 ease-in-out hover:scale-120' onClick={handleLogout}>Logout</button>
           <button className='btn bg-red-500 border border-none text-white transition-transform duration-300 ease-in-out hover:scale-120' onClick={handleDelProfile}>Delete Profile</button>
          </nav>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 md:px-6 py-6 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 dark:text-white">Welcome back,{userData.firstName}</h2>
          </div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Left Column --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heatmap */}
            <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 sm:p-6 rounded-2xl dark:bg-gray-800 dark:border-gray-700 transition duration-300">
              <h3 className="text-lg text-indigo-800 font-semibold mb-4 dark:text-white">Contribution Calendar</h3>
                              {heatmapData.length === 0 ? (
  <p className="text-sm text-gray-500 text-center">No activity yet.</p>
) :(
              <div className="overflow-x-auto">
                <CalendarHeatmap
                  startDate={new Date("2025-01-01")}
                  endDate={new Date("2025-12-31")}
                  values={heatmapData}
                  showWeekdayLabels={true}
                  classForValue={(value) => {
                    if (!value) return "color-empty";
                    if (value.count >= 4) return "color-indigo-4";
                    if (value.count === 3) return "color-indigo-3";
                    if (value.count === 2) return "color-indigo-2";
                    if (value.count === 1) return "color-indigo-1";
                    return "color-empty";
                  }}
                  tooltipDataAttrs={(value) =>
                    value.date
                      ? {
                          "data-tooltip-id": "heatmap-tooltip",
                          "data-tooltip-content": `${value.count} submission(s) on ${format(parseISO(value.date), "PPP")}`,
                        }
                      : { "data-tooltip-id": "heatmap-tooltip", "data-tooltip-content": "No submissions" }
                  }
                />
                <Tooltip id="heatmap-tooltip" />
              </div>
)}
            </div>

            {/* Leaderboard */}
            <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 sm:p-6 rounded-2xl dark:bg-gray-800 dark:border-gray-700 transition duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-800 dark:text-white">Leaderboard</h3>
                <a className="text-sm text-indigo-700 font-semibold cursor-pointer" onClick={() => navigate("/leaderboard")}>View all</a>
              </div>
              {!leaderboardData ? (
  <p className="text-sm text-gray-500 text-center">No Leaderboard Data Available</p>
) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 uppercase text-xs">
                      <th>#</th>
                      <th>User</th>
                      <th>currentStreak</th>
                      <th>maxStreak</th>
                      <th>Problems</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.slice(0,3).map(user => (
                      <tr key={user.name} className="font-semibold text-gray-600 dark:text-white">
                        <td>{user.rank}</td>
                        <td>{user.name}</td>
                        <td>{user.currentStreak}</td>
                        <td>{user.MaxStreak}</td>
                        <td>{user.problemSolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
)}
            </div>
          </div>

          {/* --- Right Column --- */}
          <div className="space-y-6">
            {/* Problem Stats Bar */}
            <div className="card bg-white/50 backdrop-blur-xl p-6 shadow-md rounded-2xl dark:bg-gray-800 dark:border-gray-700 transition duration-300">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 dark:text-white">Problem Solved Stats</h3>
              {userData.problemSolved.length === 0 ? (
  <p className="text-center text-sm text-gray-500">No problems solved yet.</p>
) : (
              <div className="w-full bg-gray-200 rounded-full h-2.5 flex overflow-hidden mb-4">
                <div className="bg-[#259a8d] h-2.5" style={{ width: `${easyPercent}%` }}></div>
                <div className="bg-[#f3a148] h-2.5" style={{ width: `${mediumPercent}%` }}></div>
                <div className="bg-[#e85a87] h-2.5" style={{ width: `${hardPercent}%` }}></div>
              </div>
)}
              <div className="flex justify-between text-xs sm:text-sm text-gray-800 dark:text-white">
                <div><p className="font-bold">{userData.problemSolved.length}</p><p>TOTAL</p></div>
                <div><p className="font-bold">{userData.EasySolved}</p><p>EASY</p></div>
                <div><p className="font-bold">{userData.MediumSolved}</p><p>MEDIUM</p></div>
                <div><p className="font-bold">{userData.HardSolved}</p><p>HARD</p></div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 4 cards with icons */}
                <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 rounded-2xl text-center dark:bg-gray-800 dark:border-gray-700 transition duration-300">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl`}>
                    {
                  langUsed
                  ? langUsed === "C++" ? <BiLogoCPlusPlus /> :
                    langUsed === "Java" ? <FaJava /> :
                    langUsed === "JavaScript" ? <RiJavascriptFill /> :
                    <FaCode/>
                  : <FaCode/>
                  }
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white">LANGUAGE</p>
                  <p className="text-xl font-bold text-indigo-800 dark:text-white">{langUsed || "N/A"}</p>
                </div>
                <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 rounded-2xl text-center dark:bg-gray-800 dark:border-gray-700 transition duration-300">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl`}>
                  <FaCheckDouble/>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white">SUBMISSIONS</p>
                  <p className="text-xl font-bold text-indigo-800 dark:text-white">{problemSolvedInfo ? problemSolvedInfo.length : 0}</p>
                </div>
                <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 rounded-2xl text-center dark:bg-gray-800 dark:border-gray-700 transition duration-300">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl`}>
                    <FaFire/>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white">CURRENT STREAK</p>
                  <p className="text-xl font-bold text-indigo-800 dark:text-white">{userData.streaks.currentStreak}</p>
                </div>
                <div className="card bg-white/50 backdrop-blur-xl shadow-md p-4 rounded-2xl text-center dark:bg-gray-800 dark:border-gray-700 transition duration-300">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl`}>
                  <FaFire/>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white">MAX STREAK</p>
                  <p className="text-xl font-bold text-indigo-800 dark:text-white">{userData.streaks.MaxStreak}</p>
                </div>
            </div>
          </div>
        </div>
           <div className="card mt-4 bg-white/50 backdrop-blur-xl shadow-md p-4 sm:p-6 rounded-2xl dark:bg-gray-800 transition duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-800 dark:text-white">Recent Activity</h3>
                <a className="text-sm text-indigo-500 font-semibold cursor-pointer" onClick={() => navigate("/submissionpage")}>View all</a>
              </div>
              {!problemSolvedInfo ? (
  <p className="text-sm text-gray-500 text-center dark:text-white">No recent submissions</p>
) : (
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
            {problemSolvedInfo.slice(0,3).map((problem, index) => (
              <tr key={problem.problemId ?? index} className="font-semibold text-gray-900 dark:text-white">
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
)}
            </div>
      </main>
    </div>
);
}

export default Dashboard;
