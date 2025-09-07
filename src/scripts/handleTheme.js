const themeToggle = document.getElementById("themeToggle");

const getOpposite = (theme) => theme === "light" ? "dark" : "light";

const setTheme = (theme) => {
  // Sets html[data-theme] to "light" or "dark"
  document.documentElement.setAttribute('data-theme', theme);

  themeToggle.textContent = theme;
  themeToggle.ariaLabel = `Switch to ${getOpposite(theme)} theme`;
  localStorage.setItem("theme", theme);
}

// Initial mode
const initialTheme = localStorage.getItem("theme") || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" || "light";
setTheme(initialTheme);

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = getOpposite(currentTheme) ;
  setTheme(newTheme);
}

themeToggle.addEventListener("click", () => toggleTheme());