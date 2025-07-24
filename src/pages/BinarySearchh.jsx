import { useState,useEffect,useRef } from "react";
const codeSnippets = {
  cpp: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int size, int target) {
    int low = 0, high = size - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int target = 30;
    int index = binarySearch(arr, 5, target);
    cout << (index != -1 ? "Found at index " + to_string(index) : "Not found") << endl;
    return 0;
}`,

  java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1; // Not found
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int target = 30;
        int index = binarySearch(arr, target);
        System.out.println(index != -1 ? "Found at index " + index : "Not found");
    }
}`,

  js: `function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor(low + (high - low) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}

const numbers = [10, 20, 30, 40, 50];
const target = 30;
console.log(binarySearch(numbers, target)); // Output: 2`
};

const BinarySearch =() =>{
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [startIndex, setstartIndex] = useState(-1);
  const [endIndex, setendIndex] = useState(-1);
  const [midIndex, setmidIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [size, setSize] = useState('');
  const[selectedLanguage,setSelectedLanguage] = useState("cpp");
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const generateArray = () => {
    if (!size) return;
    const newArray = [];
    for (let i = 0; i < Number(size); i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }

    newArray.sort((a,b)=> a - b);

    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setFoundIndex(-1);
    setIsSearching(false);
    setIsComplete(false);
  };

  const startSearch = () => {
    if (!target || isSearching || array.length === 0) return;
    resetSearch();
    setIsSearching(true);
    let start = 0;
    let end = array.length -1 ;

    intervalRef.current = setInterval(() => {
        if (start > end) {
      // Target not found
      setIsSearching(false);
      setIsComplete(true);
      clearInterval(intervalRef.current);
      return;
    }
      
      const mid = Math.floor((start+end)/2);
      setstartIndex(start);
      setendIndex(end);
      setmidIndex(mid);
      if (array[mid] === Number(target)) {
        setFoundIndex(mid);
        setIsSearching(false);
        setIsComplete(true);
        clearInterval(intervalRef.current);
      } 
      else if (array[mid]>target) {
        end = mid-1;
      }
      else
      start = mid+1;
    }, 500);
  };

 const getBarColor = (index) => {
  // 1. Found element (highlight in green)
  if (index === foundIndex) return 'bg-green-500';
  
  // 2. Current middle element being checked (highlight in red)
  if (index === midIndex) return 'bg-red-500';
  
  // 3. Elements that have been eliminated from search range
  if (isComplete) {
    // Elements before the current search range
    if (index < startIndex) return 'bg-gray-400';
    // Elements after the current search range
    if (index > endIndex) return 'bg-gray-400';
  } else {
    // During active search
    if (index < startIndex || index > endIndex) return 'bg-gray-400';
  }
  
  // 4. Elements in the current search range (not yet checked)
  return 'bg-blue-500';
};

// Stop interval when foundIndex updates
useEffect(() => {
  if (foundIndex !== -1) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}, [foundIndex]);

    return(
      <div className='min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition duration-300'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto'>
                <div className='space-y-6'>
                    <div className='p-4 bg-purple-50 rounded-lg border border-purple-200 dark:bg-purple-900/200 dark:border-purple-700'>
                    <h2 className='text-xl font-semibold text-purple-700 mb-2'>📝 Linear Search</h2>
                   <p className='dark:text-gray-300'><strong>🔹 Data Type:</strong> Ordered (Sorted List Required)</p>
                   <p className='dark:text-gray-300'><strong>🔄 Approach:</strong> Divide & Conquer (Repeatedly Splitting the Search Space in Half)</p>
                   <p className='dark:text-gray-300'><strong>🚀 Best Feature:</strong> Highly Efficient for Large Datasets (O(log n) time complexity)</p>
                   <p className='dark:text-gray-300'><strong>⚠️ Drawback:</strong> Requires Sorted Data Before Searching</p>
                   <p className='dark:text-gray-300'><strong>🌀 Behavior:</strong> Compares Middle Element, Adjusts Search Space Left/Right Until Match is Found</p>
                   <p className='dark:text-gray-300'><strong>✔️ Used In:</strong> Fast Searching in Sorted Lists, Index Lookups, Search Optimizations in Databases</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200
                    dark:bg-gray-800 dark:border-gray-700 transition duration-300'>
                        <h2 className='text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white'>Binary Search Visualization</h2>
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
  <h3 className="text-lg font-medium mb-3">Color Legend</h3>
  <div className="grid grid-cols-2 gap-3">
    <div className="flex items-center">
      <div className="w-5 h-5 bg-red-500 rounded mr-3 border border-gray-300"></div>
      <span className="text-sm">Current element being checked</span>
    </div>
    <div className="flex items-center">
      <div className="w-5 h-5 bg-green-500 rounded mr-3 border border-gray-300"></div>
      <span className="text-sm">Found target element</span>
    </div>
    <div className="flex items-center">
      <div className="w-5 h-5 bg-blue-500 rounded mr-3 border border-gray-300"></div>
      <span className="text-sm">Active search range</span>
    </div>
    <div className="flex items-center">
      <div className="w-5 h-5 bg-gray-400 rounded mr-3 border border-gray-300"></div>
      <span className="text-sm">Eliminated from search</span>
    </div>
  </div>
</div>
                    <div className="min-h-[100px] w-auto flex flex-wrap items-center gap-4 justify-start p-4 bg-gray-50 border border-gray-50 rounded-md">
  {array.map((div,index) => (
    <div className={`flex rounded-md justify-center items-center text-white w-10 h-10 animate-[popUp_0.5s_ease-in-out] ${getBarColor(index)}`} >
      {div}
    </div>
  ))}
</div>
                    </div>
                   <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200
                   dark:bg-gray-800 dark:border-gray-700 transition duration-300'>
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Binary Search Operations</h2>
      <div className='flex justify-start items-center gap-5'>
        <input 
          type="number" 
          placeholder="Enter Size Value" 
          className="input input-bordered" 
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Enter Target Value" 
          className="input input-bordered" 
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </div>
      <div className='flex justify-center items-center gap-5 mt-5'>
        <button 
          className="btn btn-primary" 
          onClick={generateArray}
          disabled={!size}
        >
          Generate Array
        </button>
        <button 
          className="btn btn-success text-white" 
          onClick={startSearch}  
          disabled={!target || isSearching || array.length === 0}
        >
          {isSearching ? "Searching..." : "Binary Search"}
        </button>
      </div>
      
    </div>
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
  <div className="flex flex-col gap-5 flex-wrap rounded-md p-5 bg-white shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700 transition duration-300">
  <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-4">
    ⚡ Time Complexity of Binary Search
  </h1>

  <div className="grid grid-cols-1 gap-4">
    {/* Insertion */}
    <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Best Case</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(1)</span>
          <span className="text-gray-700 dark:text-gray-300"><strong> First Element of Array: </strong>Accessed using arr[0]</span>
          </li>
      </ul>
    </div>

    {/* Deletion */}
    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-2">Average Case</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(N)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Element somewhere middle of array</strong></span>
        </li>

      </ul>
    </div>
    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
      <h2 className="text-xl font-semibold text-red-700 dark:text-red-200 mb-2">Worst case</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(N)
</span>
          <span className="text-gray-700 dark:text-gray-300"><strong>Last Element</strong></span>
</li>
      </ul>
    </div>
  </div>
  </div>

  {/* Summary */}
 <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition duration-300">
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Space Complexity</h2>
    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Space Complexity</h3>
            <div className="flex justify-between">
              <span className="dark:text-gray-300">Memory usage:</span>
              <span className="font-mono bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">O(1)</span>
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

export default BinarySearch;
