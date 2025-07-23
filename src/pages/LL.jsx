import React, { useState } from 'react';
import { motion } from 'framer-motion';

const validColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

const getRandomColor = () => {
  return validColors[Math.floor(Math.random() * validColors.length)];
};

const LinkedList = () => {
  const [nodes, setNodes] = useState([
    { id: 1, value: 5, color: "bg-teal-400" },
    { id: 2, value: 10, color: "bg-indigo-400" }
  ]);
  const [val, setVal] = useState("");
  const [val2,setVal2] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [error,setError] = useState(null);

  const addNode = () => {
    if (!val) 
    {
      setError("Not an Vaild Value");
      return;
    }
    
    const newNode = {
      id: Date.now(),
      value: parseInt(val),
      color: getRandomColor()
    };

    setNodes([...nodes, newNode]);
    setVal("");
  };

  const removeNode = () => {
    if (nodes.length > 0) {
      setNodes(nodes.slice(1));
    }
  };

  const addAtBegin = () =>{
     if (!val2){
      setError("Not an Vaild Value");
      return;
     }

    const newNode = {
      id: Date.now(),
      value: parseInt(val2),
      color: getRandomColor()
    };

    setNodes([newNode,...nodes]);
    setVal("");
  }

  const removeAtEnd = () =>{
    setNodes([...nodes.slice(0, -1)]);
  }

const codeSnippets = {
  cpp : `// C++ Linked List Implementation
#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* next;
  Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
  Node* head;
public:
  LinkedList() : head(nullptr) {}
  
  void insertAtEnd(int val) {
    Node* newNode = new Node(val);
    if (!head) head = newNode;
    else {
      Node* temp = head;
      while (temp->next) temp = temp->next;
      temp->next = newNode;
    }
  }
  
  void deleteFromBeginning() {
    if (head) {
      Node* temp = head;
      head = head->next;
      delete temp;
    }
  }
};`,

java : `// Java Linked List Implementation
public class LinkedList {
  class Node {
    int data;
    Node next;
    Node(int val) { data = val; }
  }
  
  Node head;
  
  public void insertAtEnd(int val) {
    Node newNode = new Node(val);
    if (head == null) head = newNode;
    else {
      Node temp = head;
      while (temp.next != null) temp = temp.next;
      temp.next = newNode;
    }
  }
  
  public void deleteFromBeginning() {
    if (head != null) {
      head = head.next;
    }
  }
}`,

js : `// JavaScript Linked List Implementation
class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insertAtEnd(val) {
    const newNode = new Node(val);
    if (!this.head) this.head = newNode;
    else {
      let temp = this.head;
      while (temp.next) temp = temp.next;
      temp.next = newNode;
    }
  }
  
  deleteFromBeginning() {
    if (this.head) {
      this.head = this.head.next;
    }
  }
}`
};

   return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Node Visualization */}
             <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-2">📝 Linked List</h2>
      <p>🔗 <strong>Data Structure Type:</strong> Linear & dynamic</p>
<p>📌 <strong>Elements:</strong> Nodes containing data & pointers</p>
<p>↔️ <strong>Traversal:</strong> Sequential access using pointers</p>
<p>🚀 <strong>Best Feature:</strong> Efficient insertions & deletions (O(1) at head)</p>
<p>⚠️ <strong>Drawback:</strong> Slow random access (O(n) for searching)</p>
<p>🌀 <strong>Variants:</strong> Singly, Doubly, Circular Linked Lists</p>
<p>✔️ <strong>Flexibility:</strong> Dynamic memory allocation, unlike arrays</p>
    </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Linked List Visualization</h2>
              <div className="min-h-[200px] flex flex-wrap items-center gap-4 justify-center p-4 bg-gray-50 rounded-lg">
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <motion.div
                      animate={{ scale: [0, 1], opacity: [0, 1] }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-full flex justify-center items-center text-white text-2xl font-bold ${node.color}`}
                    >
                      {node.value}
                    </motion.div>
                    {index < nodes.length - 1 && (
                      <motion.svg
                        width="40"
                        height="16"
                        viewBox="0 0 50 20"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <line x1="5" y1="10" x2="45" y2="10" stroke="currentColor" strokeWidth="2" className="text-gray-400" />
                        <polygon points="45,5 45,15 50,10" fill="currentColor" className="text-gray-400" />
                      </motion.svg>
                    )}
                  </div>
                ))}
                {nodes.length === 0 && (
                  <div className="text-gray-500 italic">No nodes in the list</div>
                )}
              </div>
            </div>
  
            {/* Operations */}
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-700 ">Insert at End / Delete from Beginning</h3>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Enter node value"
                    className="input input-bordered w-full"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button 
                      className="btn btn-success flex-1"
                      onClick={addNode}
                    >
                      Add Node
                    </button>
                    <button 
                      className="btn btn-error flex-1"
                      onClick={removeNode}
                      disabled={nodes.length === 0}
                    >
                      Delete First
                    </button>
                  </div>
                </div>
              </div>
  
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">Insert at Front / Delete from End</h3>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Enter node value"
                    className="input input-bordered w-full"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button className="btn btn-success flex-1" onClick={addAtBegin}>
                      Add Front
                    </button>
                    <button className="btn btn-error flex-1" onClick={removeAtEnd}
                    disabled={nodes.length === 0}>
                      Delete Last
                    </button>
                  </div>
                </div>
              </div>
              <div className='bg-white text-center rounded-xl shadow-md p-6 border border-gray-200'>{error || "LinkedList Status"}</div>
            </div>
          </div>
  
          {/* Right Column */}
          <div className="space-y-6">
    {/* Time Complexity Section */}
    <div className="flex flex-col gap-5 flex-wrap rounded-md p-5 bg-white shadow-lg">
    <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white mb-4">
      ⚡ Time Complexity of Linked List Operations
    </h1>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Insertion */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-2">🔄 Insertion</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(1)</span>
            <span className="text-gray-700 dark:text-gray-300"><strong>At beginning:</strong> Just update the head pointer.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-2">O(n)</span>
            <span className="text-gray-700 dark:text-gray-300"><strong>At end:</strong> Must traverse the entire list to find the tail.</span>
          </li>
        </ul>
      </div>
  
      {/* Deletion */}
      <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-200 mb-2">🗑️ Deletion</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(1)</span>
            <span className="text-gray-700 dark:text-gray-300"><strong>At beginning:</strong> Just update the head pointer.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded mr-2">O(n)</span>
            <span className="text-gray-700 dark:text-gray-300"><strong>At end:</strong> Must traverse to the second-last node.</span>
          </li>
        </ul>
      </div>
    </div>
  
    {/* Traversal */}
    <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">🔍 Traversal</h2>
      <div className="flex items-start">
        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded mr-2">O(n)</span>
        <span className="text-gray-700 dark:text-gray-300">
          Must visit every node sequentially (no random access).
        </span>
      </div>
    </div>
  
    {/* Summary */}
  </div>
  
     <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Space Complexity</h2>
  
    <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-2">Space Complexity</h3>
                  <div className="flex justify-between">
                    <span>Memory usage:</span>
                    <span className="font-mono bg-purple-100 px-2 py-1 rounded">O(1)</span>
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

export default LinkedList;
