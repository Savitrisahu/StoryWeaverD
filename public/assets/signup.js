document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("form");

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        })
        .then(res => res.text())
        .then(data => {
            if (data.includes("Error") || data.includes("exists")) {
                alert(data);
            } else {
                alert("Signup successful!");
                // Optionally store username locally for navbar greeting
                localStorage.setItem("username", username);
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "/index";
            }
        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong. Try again.");
        });
    });
});
