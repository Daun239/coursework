import React from "react";
import { useTheme } from "./ThemeProvider"; // import your custom useTheme hook

const ThemeToggle = () => {
    const { setTheme, theme } = useTheme(); // Access setTheme and current theme from context

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setTheme('dark'); // If checked, set dark mode
        } else {
            setTheme('light'); // If unchecked, set light mode
        }
    };

    return (
        <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input
                type="checkbox"
                onChange={handleChange}
                checked={theme === 'dark'} // Sync the checkbox with the current theme
            />
            {/* sun icon */}
            <svg
                className="swap-on fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M5.64 17.657l-1.414 1.414L2.807 17.64l1.414-1.414zM4 12H1v-2h3zm10-9h-2v3h2zm7.193 5.243l-1.414-1.414L17.657 5.64l1.414 1.414zM20 12h3v-2h-3zM18.364 17.657l1.414 1.414-1.414 1.414-1.414-1.414zM12 20h-2v3h2zm-7.193-5.243l1.414 1.414L6.343 18.36l-1.414-1.414z" />
            </svg>
            {/* moon icon */}
            <svg
                className="swap-off fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M21.752 15.002A9 9 0 0112 3a9.003 9.003 0 00.002 18A9.003 9.003 0 0021.752 15z" />
            </svg>
        </label>
    );
};

export default ThemeToggle;
