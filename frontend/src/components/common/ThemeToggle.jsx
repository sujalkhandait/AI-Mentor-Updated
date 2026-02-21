import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
