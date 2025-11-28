document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("storyForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const story = document.getElementById("story").value.trim();

    if (!title || !author || !genre || !story) {
      alert("Please fill all fields!");
      return;
    }

    const storyData = { title, author, genre, story };

    try {
      const response = await fetch("/Story-Submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        const savedStory = await response.json(); // assuming backend returns saved story
        alert("Story submitted successfully!");
        window.location.href = `/story/${savedStory._id}`;
      } else {
        alert("Failed to submit story. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the story.");
    }

    form.reset();
  });
});
