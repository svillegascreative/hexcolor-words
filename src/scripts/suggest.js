const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const suggestModal = document.getElementById("suggestModal");

openModalBtn.addEventListener("click", () => {
  suggestModal.classList.add("active");
});
closeModalBtn.addEventListener("click", () => {
  suggestModal.classList.remove("active");
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    suggestModal.classList.remove("active");
  }
});
suggestModal.addEventListener("click", (e) => {
  if (e.target === suggestModal) {
    suggestModal.classList.remove("active");
  }
});

const suggestForm = document.getElementById("suggestColorForm");
suggestForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const hex = document.getElementById("suggestHex").value.trim();
  const name = document.getElementById("suggestName").value.trim();
  const url = document.getElementById("suggestUrl").value.trim();
  const btn = suggestForm.querySelector('button[type="submit"]');
  // Check for duplicate name (case-insensitive)
  const existingNames = Array.from(
    document.querySelectorAll(".grid .name")
  ).map((a) => a.textContent.trim().toLowerCase());
  if (existingNames.includes(name.toLowerCase())) {
    alert("That word already exists in the color list.");
    return;
  }
  btn.disabled = true;
  btn.textContent = "Submitting...";
  try {
    const res = await fetch(
      "https://hexcolor-words.netlify.app/.netlify/functions/suggest-color",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex, name, url }),
      }
    );
    const data = await res.json();
    if (res.ok && data.pr_url) {
      alert(
        "Thank you! Your suggestion was submitted.\nPull request: " +
          data.pr_url
      );
      suggestForm.reset();
      document.getElementById("suggestModal").classList.remove("active");
    } else {
      alert("Error: " + (data.message || "Could not create pull request."));
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
  btn.disabled = false;
  btn.textContent = "Submit";
});
