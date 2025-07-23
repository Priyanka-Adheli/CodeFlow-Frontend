import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/HomePage";
import Problems from "./pages/Problems";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import ProblemCreate from "./pages/ProblemCreatePage";
import ProblemUpdate from "./pages/ProblemUpdatePage";
import ProblemPage from "./pages/ProblemPage"
import ProblemInfo from "./pages/ProblemInfo";
import Dashboard from "./pages/Dashboard";
import PotdCard from "./pages/POTDCard";
import LeaderboardPage from "./pages/Leaderboard";
import SubmissionPage from "./pages/SubmissionPage";
import AIInterviewBot from "./pages/AiInterview";
import ComplexityAnalysis from "./pages/ComplexityAnalysis";
import InterviewChat from "./pages/InterviewChat";
import InterviewWithAi from "./pages/InterviewPage";
import Stack from "./pages/Stack";
import LinkedList from "./pages/LL";
import LinearSearch from "./pages/LinearSearch";
import Queue from "./pages/Queue";
import BinarySearch from "./pages/BinarySearchh";
import BubbleSort from "./pages/BubbleSort";
function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return(
            <div className="min h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
  }

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Home></Home>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>

      {/* Problems Routes */}
      <Route path="/problems" element={isAuthenticated?<Problems/>:<Login></Login>}></Route>
      <Route path="/problem/:problemId" element={isAuthenticated ? <ProblemInfo/>:<Signup></Signup>}></Route>
      <Route path="/potd" element={isAuthenticated ? <PotdCard/>:<Signup></Signup>}></Route>

      {/* User Ui's */}
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard/>:<Signup></Signup>}></Route>
      <Route path="/leaderboard" element={<LeaderboardPage/>}/>
      <Route path="/submissionpage" element={isAuthenticated ? <SubmissionPage/>:<Signup/>}/>

      {/* Ai Routes */}
      <Route path="/analyze" element={isAuthenticated ? <ComplexityAnalysis/>:<Signup/>}/>
      <Route path='/ai/interview' element={isAuthenticated ? <AIInterviewBot/>:<Signup/>}/>
      <Route path='/interviewChat/:id' element={isAuthenticated ? <InterviewChat/>:<Signup/>}/>
      <Route path='/interview/start' element={isAuthenticated ? <InterviewWithAi/>:<Signup/>}/>

      {/* Admin Routes */}
      <Route path='/admin/create' element={isAuthenticated && user?.role === 'admin' ? <ProblemCreate/>: <Signup></Signup>}/>
      <Route path='/admin/update' element={isAuthenticated && user?.role === 'admin' ? <ProblemUpdate/>: <Signup></Signup>}/>

      {/* DSA Visualizer Routes */}
      <Route path='/stack' element={<Stack/>}/>
      <Route path='/queue' element={<Queue/>}/>
      <Route path='/linkedlist' element={<LinkedList/>}/>
      <Route path='/linearsearch' element={<LinearSearch/>}/>
      <Route path='/binarysearch' element={<BinarySearch/>}/>
      <Route path='/bubblesort' element={<BubbleSort/>}/>

    </Routes>
  </>
  )
}

export default App;