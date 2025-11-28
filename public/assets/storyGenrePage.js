document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/library";
    });
  }

  // Optional: handle like buttons if not using form POST
  const likeButtons = document.querySelectorAll(".like");
  likeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const storyId = btn.closest(".storyBoxes").dataset.storyId;
      fetch(`/like/${storyId}`, { method: "POST" })
        .then(() => {
          const currentCount = parseInt(btn.textContent.match(/\d+/)[0]) || 0;
          btn.textContent = `Like (${currentCount + 1})`;
        })
        .catch((err) => console.error(err));
    });
  });
});
