document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect to login if not logged in
  if (isLoggedIn !== "true") {
    alert("Please login to access the library!");
    window.location.href = "/login";
    return;
  }

  const storyContainer = document.querySelector(".storyBox"); 
  if (!storyContainer) return;

  // Instead of localStorage, you can use EJS rendered stories
  // If you still want localStorage fallback:
  const stories = window.stories || JSON.parse(localStorage.getItem("stories")) || [];

  stories.forEach((story, index) => {
    const genreClass = story.genre
      .toLowerCase()
      .replace(/\s+/g, "-") // e.g. "Sci Fi" → "sci-fi"
      .replace(/[^a-z0-9-]/g, ""); // remove special chars

    const storyDiv = document.createElement("div");
    storyDiv.classList.add("storyBoxes");

    storyDiv.innerHTML = `
      <p class="genre ${genreClass}">${story.genre}</p>
      <div class="title">
        <a href="/story/${story._id || index}">${story.title}</a>
      </div>
      <div class="story">
        <p>${story.content.substring(0, 150)}...</p>
      </div>
      <hr>
      <div class="authorLike">
        <p>By ${story.author}</p>
        <form action="/like/${story._id || index}" method="POST">
          <button class="like" type="submit">Like (${story.likes || 0})</button>
        </form>
      </div>
    `;

    storyContainer.appendChild(storyDiv);
  });

  // Update genre counts dynamically
  const genreLinks = document.querySelectorAll(".links a");
  const genreCounts = {};

  genreLinks.forEach(link => {
    const text = link.textContent.trim().replace(/\(\d+\)/, "").trim();
    genreCounts[text] = 0;
  });

  stories.forEach(story => {
    const genre = story.genre.trim();
    if (genreCounts.hasOwnProperty(genre)) {
      genreCounts[genre]++;
    }
  });

  genreLinks.forEach(link => {
    const text = link.textContent.trim().replace(/\(\d+\)/, "").trim();
    const countSpan = link.querySelector(".count");
    if (countSpan) {
      countSpan.textContent = `(${genreCounts[text] || 0})`;
    }
  });

  // Update All count
  const allLink = Array.from(genreLinks).find(link =>
    link.textContent.trim().startsWith("All")
  );
  if (allLink) {
    const countSpan = allLink.querySelector(".count");
    if (countSpan) {
      countSpan.textContent = `(${stories.length})`;
    }
  }
});
