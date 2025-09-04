const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchInput = document.getElementById("searchInput");
clearSearchBtn.addEventListener("click", function () {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
  searchInput.focus();
});
