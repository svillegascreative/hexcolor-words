const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();

  document.querySelectorAll(".grid > li").forEach((block) => {
    const hex = block.querySelector(".hex").textContent.toLowerCase();
    const name = block.querySelector(".name").textContent.toLowerCase();

    if (hex.startsWith(val) || name.startsWith(val) || val === "") {
      block.style.display = "initial"
    } else {
      block.style.display = "none"
    }
  });
});
