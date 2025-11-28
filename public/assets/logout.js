document.addEventListener("DOMContentLoaded", () => {
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
logoutBtn.addEventListener("click", (e) => {
e.preventDefault();

  // Clear client-side session/local storage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");

  // Redirect to homepage or login page
  window.location.href = "/login";
});


}
});
