import {useState} from 'react';
const validColors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

const getRandomColor = () =>{
    return validColors[Math.floor(Math.random()*validColors.length)];
}
const codeSnippets = {
    cpp: `#include <iostream>
using namespace std;

class Stack {
    int arr[1000], topIndex;
public:
    Stack() { topIndex = -1; }
    void push(int val) { arr[++topIndex] = val; }
    void pop() { if (topIndex >= 0) topIndex--; }
    int top() { return (topIndex >= 0) ? arr[topIndex] : -1; }
    bool isEmpty() { return topIndex == -1; }
};`,

    java: `import java.util.Stack;

public class StackOperations {
    Stack<Integer> stack = new Stack<>();

    public void push(int val) { stack.push(val); }
    public void pop() { if (!stack.isEmpty()) stack.pop(); }
    public int top() { return stack.isEmpty() ? -1 : stack.peek(); }
    public boolean isEmpty() { return stack.isEmpty(); }
}`,

    js: `class Stack {
    constructor() { this.stack = []; }
    push(val) { this.stack.push(val); }
    pop() { if (this.stack.length) this.stack.pop(); }
    top() { return this.stack.length ? this.stack[this.stack.length - 1] : null; }
    isEmpty() { return this.stack.length === 0; }
}`
};
const Stack = () =>{
    const [divs,setDivs] = useState([{id:1,color:"bg-red-400",value:12,animation:"animate-[slideIn_0.5s_ease-in-out]"}]);
    const [val,setVal] = useState(null);
    const [selectedLanguage,setSelectedLanguage] = useState("cpp");
    const [error,setError] = useState(null);

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
            animation:"animate-[slideIn_0.5s_ease-in-out]"
        };
        setDivs([newDiv,...divs]);
    }


    const removeDiv = ()=>{
        
        if(divs.length==0)
        {
            setError("Stack is Empty!");
            return;
        }

        let div = [...divs];
        div[0].animation = "animate-[fadeOut_0.5s_forwards]";

        setDivs(div);

        setTimeout(()=>{
            setDivs(div.slice(1));
        },500);
    }
return (
  <div className='min-h-screen pt-20 bg-gray-50 dark:bg-gray-900'>
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto'>
      <div className='space-y-6'>
        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
          <h2 className='text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2'>📝 Stack</h2>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>🔹 Data Type:</strong> Linear</p>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>🔄 Approach:</strong> Last In, First Out (LIFO)</p>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>🚀 Best Feature:</strong> Efficient for managing function calls & undo operations</p>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>⚠️ Drawback:</strong> Limited direct access to elements</p>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>🌀 Behavior:</strong> Push to add, Pop to remove from the top</p>
          <p className='dark:text-gray-300'><strong className='dark:text-white'>✔️ Used In:</strong> Recursion, Expression Evaluation, Backtracking</p>
        </div>
        
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition duration-300'>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white'>Stack Visualizer</h2>
          <div className="min-h-[200px] flex flex-row flex-wrap items-center gap-4 justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="min-h-[200px] w-[150px] flex flex-col flex-wrap items-center gap-4 justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-bl-lg rounded-br-lg border-b-2 border-l-2 border-r-2 border-gray-500 dark:border-gray-600">
              {divs.map((div) => (
                <div key={div.id} className={`${div.color} w-full h-10 ${div.animation} flex justify-center items-center text-white`}>
                  {div.value}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition duration-300'>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Stack Operations</h2>
          <input 
            type='number' 
            placeholder='Enter Value' 
            className='input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white' 
            value={val} 
            onChange={(e)=>setVal(e.target.value)}
          />
          
          <div className='flex justify-center items-center'>
            <div className='btn btn-success m-2.5 dark:bg-green-700 dark:border-green-600' onClick={addDiv}>Push</div> 
            <div className='btn btn-error m-2.5 dark:bg-red-700 dark:border-red-600' onClick={removeDiv}>Pop</div> 
            <div 
              className="btn btn-warning m-2.5 dark:bg-yellow-700 dark:border-yellow-600"  
              onClick={(e) => {
                const target = e.target.parentElement.nextElementSibling;
                target.classList.toggle("hidden");
              }}
            >
              Peek
            </div>
          </div>
          <div className="hidden text-center dark:text-gray-300">
            {divs.length > 0 ? `Top Element of Stack is ${divs[0]?.value}` : "Stack is Empty"}
          </div>
        </div>
        
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 dark:text-gray-300 transition duration-300'>
          {error || "Stack Info"}
        </div>
        
        <style>
          {`
            @keyframes slideIn {
              0% { transform: translateX(-100%); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
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
        <div className="flex flex-col gap-5 flex-wrap rounded-md p-5 bg-white dark:bg-gray-800 shadow-lg transition duration-300">
          <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-4">
            ⚡ Time Complexity of Stack Operations
          </h1>

          <div className="grid grid-cols-1 gap-4">
            {/* Peek */}
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">Peek:</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(1)</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong> Top element of Stack Accessed</strong></span>
                </li>
              </ul>
            </div>

            {/* Push */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Push</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(1)</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Inserted At top of Stack</strong></span>
                </li>
              </ul>
            </div>
            
            {/* Pop */}
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Pop</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(1)</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Top Element of Stack is removed</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition duration-300">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Space Complexity</h2>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Space Complexity</h3>
            <div className="flex justify-between">
              <span className="dark:text-gray-300">Memory usage:</span>
              <span className="font-mono bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">O(N)</span>
            </div>
          </div>
        </div>
        
        {/* Code Snippets */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition duration-300">
          <div className="tabs tabs-boxed bg-gray-100 dark:bg-gray-700 dark:text-white">
            <button className={`tab ${selectedLanguage === "cpp" ? "tab-active" : ""} dark:text-white`} onClick={() => setSelectedLanguage("cpp")}>C++</button>
            <button className={`tab ${selectedLanguage === "java" ? "tab-active" : ""} dark:text-white`} onClick={() => setSelectedLanguage("java")}>Java</button>
            <button className={`tab ${selectedLanguage === "js" ? "tab-active" : ""} dark:text-white`} onClick={() => setSelectedLanguage("js")}>JavaScript</button>
          </div>
          <div className="p-4 bg-gray-800 text-white overflow-auto max-h-[300px] rounded-md">
            <pre className="p-3 rounded-md mt-2 overflow-auto">{codeSnippets[selectedLanguage]}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
export default Stack;
