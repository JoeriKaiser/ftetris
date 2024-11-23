import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);

    const handlePress = () => {
        setDarkMode(!darkMode);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
    }
  
    return (
      <button
        onClick={handlePress}
        className="p-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-200">
        <div>
          {darkMode ? (
            <Moon className="w-5 h-5 text-yellow-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </button>
    );
  }