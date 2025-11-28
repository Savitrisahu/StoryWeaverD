document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", (e) => {
        // Prevent default to show alert or do extra checks
        if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
            e.preventDefault();
            alert("Please fill both fields");
            return;
        }

        // Optionally store username locally for navbar greeting
        localStorage.setItem("username", usernameInput.value.trim());
        localStorage.setItem("isLoggedIn", "true");

        // Form will submit normally to /login (POST)
    });
});
