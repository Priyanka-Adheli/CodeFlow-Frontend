import { useEffect, useState } from "react";
import { FiSun,FiMoon } from "react-icons/fi";
const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="p-2 rounded"
    >
      {theme === "dark" ? <FiSun className="h-5 w-5"/>: <FiMoon className="h-5 w-5"/>}
    </button>
  );
};

export default ThemeToggle;
