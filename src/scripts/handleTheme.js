const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  // Sets html[data-theme] to "light" or "dark"
  document.documentElement.setAttribute('data-theme', theme);

  themeToggle.textContent = theme ; // TODO: CSS
  localStorage.setItem("theme", theme);
}

// Initial mode
const initialTheme = localStorage.getItem("theme") || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" || "light";
setTheme(initialTheme);

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

themeToggle.addEventListener("click", () => toggleTheme());