import React, { useState,useRef } from 'react';

const validColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

const getRandomColor = () => {
  return validColors[Math.floor(Math.random() * validColors.length)];
};

  const codeSnippets = {
        cpp: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]); 
            }
        }
    }
}`,
        java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
        js: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`

};
const BubbleSort = () => {

  const [arr,setArr] = useState([10,20,18,25,14]);
  const [size,setSize] = useState(5);
  const [comparsion,setComparison] = useState("State of Sorting");
  const [selectedLanguage,setSelectedLanguage] = useState("cpp");
  const [isRunning, setIsRunning] = useState(false);
  const [stop, setStop] = useState(false);


  const generateArray = () =>{
    if(size<=0)
    {
      setComparison("Select the array size > 0");
      return;
    }
    const newArr = Array.from({length:size},()=>
    Math.floor(Math.random()*91)+10
  );

  setArr(newArr);
  setComparison("Random values array generated!");
  }

const iRef = useRef(0);
const jRef = useRef(0);
const bubbleSort = () => {
    let tempArr = [...arr];
    iRef.current = 0;
    jRef.current = 0;
    setStop(false);
    setIsRunning(true);
    const interval = setInterval(() => {
       if (!isRunning || stop) {
            clearInterval(interval);
            return;
        }

        if (iRef.current < tempArr.length) {
            if (jRef.current < tempArr.length - iRef.current - 1) {
                setComparison(`Comparing: ${tempArr[jRef.current]} & ${tempArr[jRef.current + 1]}`);
                if (tempArr[jRef.current] > tempArr[jRef.current + 1]) {
                    [tempArr[jRef.current], tempArr[jRef.current + 1]] = [tempArr[jRef.current + 1], tempArr[jRef.current]];
                    setArr([...tempArr]);
                }
                jRef.current++;
            } else {
                iRef.current++;
                jRef.current = 0;
            }
        } else {
            clearInterval(interval);
            setComparison("Sorting Complete!");
            setIsRunning(false);
        }
    }, 500);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Node Visualization */}
           <div className="p-4 bg-purple-50 dark:bg-purple-900/200 rounded-lg border border-purple-200 dark:border-purple-700">
    <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-2">📝 Bubble Sort</h2>
    <p className='dark:text-gray-300'><strong>🔹Sorting Type:</strong> Comparison-based</p>
<p className='dark:text-gray-300'><strong>🔄 Approach: </strong>Repeatedly swap adjacent elements if they are in the wrong order</p>
<p className='dark:text-gray-300'><strong>🚀 Best Feature:</strong> Simple & easy to understand</p>
<p className='dark:text-gray-300'><strong>⚠️ Drawback:</strong> Slow for large datasets</p>
<p className='dark:text-gray-300'><strong>🌀 Behavior:</strong> Moves the largest elements to the end one step at a time</p>
<p className='dark:text-gray-300'><strong>✔️ Stable Sort:</strong> Yes, preserves order of equal elements</p>
  </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200
          dark:bg-gray-800 dark:border-gray-700 transition duration-300">
          
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Bubble Sort Visualization</h2>
            <div className="min-h-[200px] flex flex-col flex-wrap items-center gap-4 justify-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <div className='text-2xl text-center dark:text-white'>{comparsion}</div>
              <div className='flex gap-4'>
              {arr.map((value, index) => (
                        <div key={index} 
                            className={`bg-blue-500 w-8 text-center text-white transition-all duration-500 rounded-sm ${getRandomColor()}`}
                            style={{ height: `${value * 3}px` }}>
                            {value}
                        </div>
                    ))}
                    </div>
            </div>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition duration-300">
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-white">Enter Array Size</h3>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter Size of Array"
                  className="input input-bordered w-full"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
                <div className="flex gap-3">
                  <button 
                    className="btn btn-success flex-1"
                    onClick={generateArray}
                  >
                    generate Random Array
                  </button>
                    <button 
                    className="btn btn-accent flex-1"
                    onClick={bubbleSort}
                  >
                    Start Bubble Sort
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
  {/* Time Complexity Section */}
  <div className="flex flex-col gap-5 flex-wrap rounded-md p-5 bg-white shadow-lg
  dark:bg-gray-800 dark:border-gray-700 transition duration-300">
  <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-4">
    ⚡ Time Complexity of Bubble Sort
  </h1>

  <div className="grid grid-cols-1 gap-4">
    {/* Insertion */}
    <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Best Case:</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(N)</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Array Sorted</strong>-  — When the array is already sorted, Bubble Sort only needs one pass to confirm the order.
</span>
        </li>
      </ul>
    </div>

    {/* Deletion */}
    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-2">Average Case</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(n^2)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Normal Array</strong> - Bubble Sort compares and swaps elements repeatedly, making it inefficient for large inputs.</span>
        </li>

      </ul>
    </div>
    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
      <h2 className="text-xl font-semibold text-red-700 dark:text-red-200 mb-2">Worst Case</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(n^2)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Normal Array</strong>When the array is in reverse order, Bubble Sort performs the maximum number of swaps.</span>
        </li>

      </ul>
    </div>
  </div>

  {/* Summary */}
</div>

   <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200
   dark:bg-gray-800 dark:border-gray-700 transition duration-300">
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Space Complexity</h2>
    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Space Complexity</h3>
            <div className="flex justify-between">
              <span className="dark:text-gray-300">Memory usage:</span>
              <span className="font-mono bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">O(1)</span>
            </div>
          </div>
            </div>
  {/* Code Snippets Section with Tabs */}
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
  );
};

export default BubbleSort;
