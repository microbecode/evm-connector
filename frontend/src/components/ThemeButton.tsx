import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";

import moon from "../images/moon.png";
import moonDark from "../images/moon_dark.png";

export function ThemeButton() {
  const themeKey = "Theme";
  const darkThemeClass = "dark-theme";
  const dark = "dark";
  const light = "light";

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (!localStorage) return;
    const theme = localStorage.getItem(themeKey);
    if (theme === dark) setIsDarkTheme(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps,
  }, []);

  useEffect(() => {
    console.log(isDarkTheme);
    if (!localStorage || !document?.body) return;

    if (isDarkTheme) {
      localStorage.setItem(themeKey, dark);
      document.body.classList.add(darkThemeClass);
    } else {
      localStorage.setItem(themeKey, light);
      document.body.classList.remove(darkThemeClass);
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div
      className="theme-button-container my-2 mx-auto mx-xl-0"
      onClick={toggleTheme}
    >
      <Image src={isDarkTheme ? moon : moonDark} />
    </div>
  );
}
