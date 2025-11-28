const deleteBtn = document.getElementById("deleteAccount");
if (deleteBtn) {
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch("/delete-account", {
        method: "DELETE",
        credentials: "same-origin" // important!
      });
      if (response.ok) {
        window.location.href = "/signUp"; // session destroyed on server
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred. Try again later.");
    }
  });
}
