// Dark mode setup
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const darkToggle = document.getElementById("darkToggle");
function setDarkMode(on) {
  document.body.classList.toggle("dark-mode", on);
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.toggle("dark-mode", on));
  document
    .querySelectorAll(".color-block")
    .forEach((cb) => cb.classList.toggle("dark-mode", on));
  darkToggle.textContent = on ? "☀️" : "🌙";
  localStorage.setItem("darkMode", on ? "1" : "0");
}
// Initial mode
const saved = localStorage.getItem("darkMode");
setDarkMode(saved ? saved === "1" : prefersDark);
darkToggle.addEventListener("click", () => {
  setDarkMode(!document.body.classList.contains("dark-mode"));
});