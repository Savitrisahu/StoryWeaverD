document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".likeBtn");

    likeButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const storyId = btn.dataset.id;
            try {
                const response = await fetch(`/like/${storyId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                if (response.ok) {
                    const data = await response.json();
                    btn.querySelector(".likeCount").textContent = data.likes;
                } else {
                    alert("Failed to like story.");
                }
            } catch (err) {
                console.error(err);
            }
        });
    });
});
