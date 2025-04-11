import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

const LightDarkMode = () => {
  const [mode, setMode] = useState<boolean>();

  const getInitialTheme = (): boolean => {
    const savedTheme = getCookie("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  useEffect(() => {
    const isDark = getInitialTheme();
    setMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // Listen for system preference changes (optional)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!getCookie("theme")) {
        // Only update if no cookie is set
        setMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleMode = () => {
    const newMode = !mode;
    setMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    setCookie("theme", newMode ? "dark" : "light", { expires: 365 });
  };

  return (
    <Button
      variant={"ghost"}
      onClick={toggleMode}
      className="hover:bg-transparent"
    >
      {mode ? <Sun className="size-8" /> : <Moon className="size-8" />}
    </Button>
  );
};

export default LightDarkMode;
