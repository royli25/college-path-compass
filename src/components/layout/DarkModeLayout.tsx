import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_STORAGE_KEY = 'theme';

export const DarkModeLayout = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    setTheme("dark");

    return () => {
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme('light');
      }
    };
  }, [setTheme]);

  return <>{children}</>;
}; 