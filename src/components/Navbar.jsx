import { useState } from "react";
import { Link } from "react-router"; // Updated to use react-router-dom
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaUserCircle } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Problems", to: "/problems" },
  { name: "AI Powered Interview", to: "/ai/interview" },
  { name: "Analyze Time/Space Complexity", to: "/analyze" },
  { name: "Leaderboard", to: "/leaderboard" },
  { name: "Dashboard", to: "/dashboard" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full backdrop-blur-lg bg-indigo-700 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          CodeFlow
        </Link>

        {/* Mobile Controls: ThemeToggle + Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex space-x-4">
          {navigation.map((item) => (
            <Link key={item.name} to={item.to} className="btn btn-ghost hover:none text-center">
              {item.name === "Dashboard" ? (
                <span className="flex items-center gap-2">
                  <FaUserCircle className="h-6 w-6" />
                </span>
              ) : (
                item.name
              )}
            </Link>
          ))}
          <ThemeToggle/>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} to={item.to} className="block btn btn-ghost">
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}