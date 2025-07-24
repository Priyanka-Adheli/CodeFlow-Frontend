import {useState} from 'react';

const validColors = [
   "bg-red-500", "bg-orange-500", "bg-indigo-500", "bg-yellow-500", "bg-lime-500",
  "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500",
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500",
  "bg-neutral-500", "bg-stone-500"
];

const getRandomColor = () =>{
    return validColors[Math.floor(Math.random()*validColors.length)];
}
const codeSnippets = {
  cpp: `#include <iostream>
using namespace std;

class Queue {
    int arr[1000], frontIndex, rearIndex;
public:
    Queue() { frontIndex = 0; rearIndex = 0; }
    void enqueue(int val) { arr[rearIndex++] = val; }
    void dequeue() { if (frontIndex < rearIndex) frontIndex++; }
    int front() { return (frontIndex < rearIndex) ? arr[frontIndex] : -1; }
    bool isEmpty() { return frontIndex == rearIndex; }
};`,

  java: `import java.util.LinkedList;
import java.util.Queue;

public class QueueOperations {
    Queue<Integer> queue = new LinkedList<>();

    public void enqueue(int val) { queue.add(val); }
    public void dequeue() { if (!queue.isEmpty()) queue.poll(); }
    public int front() { return queue.isEmpty() ? -1 : queue.peek(); }
    public boolean isEmpty() { return queue.isEmpty(); }
}`,

  js: `class Queue {
    constructor() { this.queue = []; }
    enqueue(val) { this.queue.push(val); }
    dequeue() { if (this.queue.length) this.queue.shift(); }
    front() { return this.queue.length ? this.queue[0] : null; }
    isEmpty() { return this.queue.length === 0; }
}`
};

const Queue = () =>{
    const [divs,setDivs] = useState([{id:1,color:"bg-red-400",value:12,animation:"animate-[popUp_0.5s_ease-in-out]"}]);
    const [val,setVal] = useState('');
    const [selectedLanguage,setSelectedLanguage] = useState("cpp");
    const [error,setError] = useState(null);
    const [showFront,setShowFront] = useState(false);
    const [showRear,setShowRear] = useState(false);

    const addDiv = () =>{

        if(!val)
        {
          setError("Please Enter value");
          return;
        }
        const newDiv ={
            id:Date.now(),
            color:getRandomColor(),
            value:val,
            animation:"animate-[popUp_0.5s_ease-in-out]"
        };
        setDivs([...divs,newDiv]);
    }


    const removeDiv = ()=>{
        
        if(divs.length==0)
        {
            setError("Queue is Empty!");
            return;
        }

        let div = [...divs];
        div[divs.length-1].animation = "animate-[fadeOut_0.5s_forwards]";

        setDivs(div);

        setTimeout(()=>{
            setDivs(div.slice(0,-1));
        },500);
    }
    return(
        <div className='min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition duration-300'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto'>
                <div className='space-y-6'>
                    <div className='p-4 bg-purple-50 dark:bg-purple-900/200 rounded-lg border border-purple-200 dark:border-purple-700'>
                        <h2 className='text-xl font-semibold text-purple-700 mb-2 dark:text-white'>📝 Queue</h2>
                     <p className='dark:text-gray-300'><strong>🔹 Data Type:</strong> Linear</p>
                     <p className='dark:text-gray-300'><strong>🔄 Approach:</strong> First In, First Out (LIFO)</p>
                     <p className='dark:text-gray-300'><strong>🚀 Best Feature:</strong> Efficient for managing function calls & undo operations</p>
                     <p className='dark:text-gray-300'><strong>⚠️ Drawback:</strong> Limited direct access to elements</p>
                     <p className='dark:text-gray-300'><strong>🌀 Behavior:</strong> Push to add, Pop to remove from the top</p>
                     <p className='dark:text-gray-300'><strong>✔️ Used In:</strong> Recursion, Expression Evaluation, Backtracking</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200
                     dark:bg-gray-800 dark:border-gray-700 transition duration-300'>
                        <h2 className='text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white'>Queue Visualizer</h2>
                    <div className="min-h-[100px] w-auto flex items-center gap-4 justify-start p-4 bg-gray-50 border border-gray-50 rounded-md dark:bg-gray-700">
  {divs.map((div) => (
    <div 
      key={div.id} 
      className={`${div.color} ${div.animation} flex rounded-md justify-center items-center text-white w-10 h-10`}
    >
      {div.value}
    </div>
  ))}
</div>
                    </div>
                    <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200
                    dark:bg-gray-800 dark:border-gray-700 transition duration-300'>
                         <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Queue Operations</h2>
                        <input type='number' placeholder='Enter Value' className='input input-bordered w-full' value={val} onChange={(e)=>setVal(e.target.value)}/>
                        
                        <div className='flex justify-center items-center'>
                        <div className='btn btn-success m-2.5' onClick={addDiv}>Enqueue</div> 
                        <div className='btn btn-error m-2.5' onClick={removeDiv}>Dequeue</div> 
                        <div className="flex gap-4">
  <div 
    className="btn btn-warning"
    onClick={() => setShowFront((prev)=> !prev)}
  >
    Get Front
  </div>
  <div 
    className="btn btn-accent"
    onClick={() => setShowRear((prev)=> !prev)}
  >
    Get Rear
  </div>
</div>

</div>
{
  showFront && (
<div className="text-center font-semibold dark:text-white">{divs.length>0?`Front Element of Queue ${divs[0].value}`:`Queue is Empty`}</div>
  )
}
{
  showRear && (
<div className="text-center font-semibold dark:text-white">{divs.length>0?`Rear Element of Queue ${divs[divs.length-1].value}`:`Queue is Empty`}</div>
  )
}
</div>
<div className='bg-white rounded-xl shadow-md p-6 border border-gray-200 dark:text-white dark:bg-gray-800 dark:border-gray-700 transition duration-300'>{error || "Queue Info Status"}</div>
<style>
       {`
          @keyframes popUp {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}


          @keyframes fadeOut {
             0% { opacity: 1; }
            100% { opacity: 0; }
         }
         `}
</style>
                </div>
                <div className="space-y-6">
  {/* Time Complexity Section */}
  <div className="flex flex-col gap-5 flex-wrap rounded-md p-5 bg-white shadow-lg
   dark:bg-gray-800 dark:border dark:border-gray-700 transition duration-300">
  <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-4">
    ⚡ Time Complexity of Queue Operations
  </h1>

  <div className="grid grid-cols-1 gap-4">
    {/* Insertion */}
    <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Front and Rear:</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(1)</span>
          <span className="text-gray-700 dark:text-gray-300"><strong> Front Array Implementaion : </strong>Accessed using arr[0]</span>
        </li>
           <li className="flex items-start">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(1)</span>
          <span className="text-gray-700 dark:text-gray-300"><strong> Rear Array Implementaion : </strong>Accessed using arr[arr.size()-1]</span>
        </li>
      </ul>
    </div>

    {/* Deletion */}
    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-2">Enqueue</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(1)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Inserted at End of Queue</strong></span>
        </li>

      </ul>
    </div>
    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
      <h2 className="text-xl font-semibold text-red-700 dark:text-red-200 mb-2">Dequeue</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(1)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>1st element of queue is removed</strong></span>
</li>
      </ul>
    </div>
  </div>
  </div>

  {/* Summary */}
 <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200
 dark:bg-gray-800 dark:border dark:border-gray-700 transition duration-300">
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Space Complexity</h2>
    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Space Complexity</h3>
            <div className="flex justify-between">
              <span className="dark:text-gray-300">Memory usage:</span>
              <span className="font-mono bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">O(N)</span>
            </div>
          </div>
          </div>
 <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <div className="tabs tabs-boxed">
    <button className={`tab ${selectedLanguage === "cpp" ? "tab-active" : ""}`} onClick={() => setSelectedLanguage("cpp")}>C++</button>
    <button className={`tab ${selectedLanguage === "java" ? "tab-active" : ""}`} onClick={() => setSelectedLanguage("java")}>Java</button>
    <button className={`tab ${selectedLanguage === "js" ? "tab-active" : ""}`} onClick={() => setSelectedLanguage("js")}>JavaScript</button>
    </div>
    <div className="p-4 bg-gray-800 text-white overflow-auto max-h-[300px] rounded-md">
    <pre className= "p-3 rounded-md mt-2 overflow-auto">{codeSnippets[selectedLanguage]}</pre>
    </div>
  </div>
</div>
</div>
</div>
    )
}
export default Queue;
