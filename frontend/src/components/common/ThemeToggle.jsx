import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
<<<<<<< HEAD
      className="btn btn-sm d-flex align-items-center gap-2"
      aria-label="Toggle Theme"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
=======
      className="flex items-center justify-center p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
>>>>>>> upstream/main
    </button>
  );
};

export default ThemeToggle;
