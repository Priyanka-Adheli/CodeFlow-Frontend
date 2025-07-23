import React,{ useState, useRef, useEffect } from 'react';
import { useNavigate,NavLink } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import { FaFilter, FaRandom } from "react-icons/fa";
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';
import PotdCard from './POTDCard';
import { CheckCircle,Circle } from 'lucide-react';
import Demo from './Demo';
const carouselCards = [
  {
    id: 1,
    title: "Stack",
    subtitle: "LIFO: Last In First Out",
    action: "Visualize Push/Pop",
    navigationLink :"/stack"
  },
  {
    id: 2,
    title: "Queue",
    subtitle: "FIFO: First In First Out",
    action: "Visualize Enqueue/Dequeue",
    navigationLink :"/queue"
  },
  {
    id: 3,
    title: "Linked List",
    subtitle: "Nodes & Pointers",
    action: "See Traversal & Insertions",
    navigationLink :"/linkedlist"
  },
  {
    id: 4,
    title: "Bubble Sort",
    subtitle: "Step-by-step Swaps",
    action: "Watch Sorting in Action",
    navigationLink :"/bubblesort"
  },
  {
    id: 5,
    title: "Binary Search",
    subtitle: "Efficient Searching",
    action: "Simulate Midpoint Logic",
    navigationLink :"/binarysearch"
  },
  {
    id: 6,
    title: "Linear Search",
    subtitle: "Simple Scan Search",
    action: "Try a Walkthrough",
    navigationLink :"/linearsearch"
  }
];

const Problems = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [problems,setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);


const allTopics = [
  "Arrays", "Linked Lists", "Stacks", "Queues", "Hash Maps", "Hash Sets",
  "Trees", "Binary Search Trees", "Heaps", "Graphs", "Recursion",
  "Dynamic Programming", "Greedy Algorithms", "Divide and Conquer", "Sorting",
  "Searching", "Bit Manipulation", "Two Pointers", "Sliding Window", "Backtracking", "Algorithms", "KMP Algorithm", "Mathematics", "Basic Operations",
  "BFS", "DFS", "Data Structures", "Strings"
];

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const scrollToSlide = (index) => {
    const cardWidth = carouselRef.current?.children[0]?.offsetWidth || 300;
    carouselRef.current.scrollTo({
      left: index * (cardWidth + 16),
      behavior: 'smooth'
    });
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
        setShowCalendar(true);
      } else {
        setShowSidebar(false);
        setShowCalendar(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblems');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
  const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);  
  const getRandomProblem = async () => {
  try {
    const response = await axiosClient.get('/problem/randomProblem'); // Your API endpoint
    const data = response.data;
    navigate(`/problem/${data._id}`);
  } catch (err) {
    console.error("Error fetching random problem", err);
  }
};
return (
    <div className="mt-16 flex flex-col h-screen overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      {/* Controls for mobile */}
      <div className="flex justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 rounded-xl lg:hidden z-10">
        <button 
          onClick={() => setShowCalendar(!showCalendar)} 
          className="text-sm text-white px-4 py-1 bg-indigo-900 dark:bg-indigo-600 rounded shadow hover:bg-indigo-800 dark:hover:bg-indigo-500 transition-colors"
        >
          {showCalendar ? "Hide Calendar" : "Calendar"}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {/* Carousel */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {carouselCards.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => scrollToSlide(i)} 
                    className={`w-2 h-2 rounded-full ${currentSlide === i ? 'bg-indigo-400 dark:bg-indigo-300' : 'bg-gray-300 dark:bg-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
            <div ref={carouselRef} className="flex scrollbar-hide overflow-x-auto space-x-4 pb-2">
              {carouselCards.map(card => (
                <div 
                  key={card.id} 
                  onClick={() => navigate(`${card.navigationLink}`)}
                  className="card p-4 sm:p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow dark:shadow-lg rounded-xl mt-4 ml-2 mr-2 min-w-[16rem] sm:min-w-[18rem] md:min-w-[20rem] transition-colors duration-300 hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer"
                >
                  <h3 className="font-medium text-indigo-900 dark:text-indigo-100 text-lg mt-1">
                    {card.title}
                  </h3>
                  <p className="text-indigo-800 dark:text-indigo-300 text-sm">
                    {card.subtitle}
                  </p>
                  <button 
                    className="font-semibold mt-3 shadow-2xl bg-indigo-800 dark:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-indigo-700 dark:hover:bg-indigo-500"
                    onClick={() => navigate(`${card.navigationLink}`)}
                  >
                    {card.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Topic + Difficulty Filters */}
          <div className="mb-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative inline-block text-left w-full">
              <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Topics</h2>
              <div className="flex overflow-x-auto gap-3 scrollbar-hide p-2" style={{ maxWidth: '100%', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                <button
                  className={`flex-shrink-0 scroll-snap-start flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition
                    ${selectedTopics.length === 0
                      ? 'bg-indigo-700 dark:bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-600 hover:text-white'}
                  `}
                  onClick={() => setSelectedTopics([])}
                >
                  All Topics
                </button>

                {allTopics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() =>
                        isSelected
                          ? setSelectedTopics(selectedTopics.filter((t) => t !== topic))
                          : setSelectedTopics([...selectedTopics, topic])
                      }
                      className={`flex-shrink-0 scroll-snap-start flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition
                        ${isSelected
                          ? 'bg-indigo-700 dark:bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-600 hover:text-white'}
                      `}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <PotdCard/>
          {/* Problems List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-4 sm:p-6 bg-white/60 dark:bg-gray-800/90 backdrop-blur-xl border border-[#D1E5E4] dark:border-gray-700 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-x-auto"
          >
            {/* Header with Filters and Random Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Problem List</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-indigo-800 dark:text-indigo-400" />
                  <select
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    value={difficultyFilter}
                    className="px-3 py-2 font-semibold rounded-md border border-indigo-800 dark:border-indigo-600 bg-white dark:bg-gray-700 text-indigo-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500 transition"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <motion.button
                  onClick={getRandomProblem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md bg-indigo-800 dark:bg-indigo-600 text-white font-medium transition shadow-sm inline-flex items-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-500"
                >
                  <FaRandom /> Pick One
                </motion.button>
              </div>
            </div>

            {/* Table Content */}
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2 px-4 text-indigo-800 dark:text-indigo-300 uppercase text-sm">Status</th>
                  <th className="py-2 px-4 text-indigo-800 dark:text-indigo-300 uppercase text-sm">Title</th>
                  <th className="py-2 px-4 text-indigo-800 dark:text-indigo-300 uppercase text-sm">Level</th>
                </tr>
              </thead>
              <tbody>
                {problems
                  .filter(problem => {
                    const levelMatch = difficultyFilter ? problem.difficulty === difficultyFilter : true;
                    const topicMatch = selectedTopics.length
                      ? selectedTopics.every(tag => problem.tags.includes(tag))
                      : true;
                    return levelMatch && topicMatch;
                  })
                  .map((problem, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => navigate(`/problem/${problem._id}`)}
                      >
                        <td className="py-2 px-4">
                          {solvedProblems.some((sp) => sp._id === problem._id) ? (
                            <CheckCircle className="text-indigo-500 dark:text-indigo-400 h-5 w-5" />
                          ) : (
                            <Circle className="text-indigo-500 dark:text-indigo-400 h-5 w-5" />
                          )}
                        </td>
                        <td className="py-2 px-4 font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}. {problem.title}
                        </td>
                        <td className="py-2 px-4">
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
                      </tr>
                      <tr>
                        <td></td>
                        <td colSpan={2} className="py-1 px-4">
                          <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#001f54]/10 dark:bg-indigo-900/30 px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:shimmer-text-white"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                }
              </tbody>
            </table>
          </motion.div>
        </div>
        
        {/* Calendar */}
        {showCalendar && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xs p-4 overflow-y-auto card bg-indigo-700 rounded-2xl mt-4 mr-4 shadow-lg dark:shadow-gray-900/50"
          >
            <div className="transform scale-95 origin-top-left w-full">
              <div className="space-y-3">
                <Demo/>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default Problems;
