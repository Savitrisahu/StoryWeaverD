document.addEventListener("DOMContentLoaded", async () => {
  const navbar = document.getElementById("navbar");

  // Fetch current user info from server
  let userInfo = { loggedIn: false };
  try {
    const res = await fetch("/current-user");
    userInfo = await res.json();
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  // Build navbar HTML
  navbar.innerHTML = `
    <a href="/index" id="logo">Story Weaver</a>
    <div class="hamburger" id="hamburger">
      <span></span><span></span><span></span>
    </div>
    <div class="nav-links" id="nav-links">
      <div class="nav1">
        <a href="/index">Home</a>
        <a href="/library">Library</a>
        ${userInfo.loggedIn ? '<a href="/myLibrary">My Library</a>' : ''}
        ${userInfo.loggedIn ? '<a href="/submit">Submit</a>' : ''}
      </div>
      <div class="nav2">
        ${
          userInfo.loggedIn
            ? `<a href="#" id="userGreeting">Hello, ${userInfo.username}</a>
               <a href="#" id="logout">Logout</a>
               <a href="#" id="deleteAccount">Delete Account</a>`
            : `<a href="/login">Login</a>
               <a href="/signUp">Sign Up</a>`
        }
      </div>
    </div>
  `;

  /* ----------------------------
       LOGIN PROTECTION ADDED
  ----------------------------- */
  if (!userInfo.loggedIn) {
    const protectedLinks = document.querySelectorAll(
      'a[href="/index"], a[href="/library"], a[href="/StoryGenrePage"], a[href^="/story"], a[href="/submit"], a[href="/myLibrary"]'
    );

    protectedLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Please login first!");
        window.location.href = "/login";
      });
    });
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await fetch("/logout", { method: "GET", credentials: "same-origin" });
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
        alert("Error logging out.");
      }
    });
  }

  // Delete account functionality
  const deleteBtn = document.getElementById("deleteAccount");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmed) return;

      try {
        const response = await fetch("/delete-account", { method: "DELETE", credentials: "same-origin" });
        if (response.ok) window.location.href = "/signUp";
        else alert("Failed to delete account.");
      } catch (err) {
        console.error(err);
        alert("Error occurred. Try again later.");
      }
    });
  }

  // Hamburger toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }
});
