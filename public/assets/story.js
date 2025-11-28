document.addEventListener("DOMContentLoaded", () => {
    const likeBtn = document.querySelector(".likeBtn");

    likeBtn.addEventListener("click", async () => {
        const storyId = likeBtn.dataset.id;

        try {
            const response = await fetch(`/like/${storyId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                const data = await response.json();
                likeBtn.querySelector(".likeCount").textContent = data.likes;
            } else {
                alert("Failed to like story.");
            }
        } catch (err) {
            console.error(err);
        }
    });

    const readBtn = document.querySelector(".readBtn");
    if (readBtn) {
        readBtn.addEventListener("click", async () => {
            const storyId = readBtn.dataset.id;
            try {
                await fetch(`/read/${storyId}`, { method: "POST" });
                readBtn.textContent = "Marked as Read";
            } catch (err) {
                console.error(err);
            }
        });
    }
});
