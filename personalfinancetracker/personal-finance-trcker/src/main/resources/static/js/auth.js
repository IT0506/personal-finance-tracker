console.log("auth.js loaded");

// Replace your login() function in auth.js with this version.
// This stores BOTH token and userId in localStorage.

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert("Login failed: " + errorText);
            return;
        }

        const data = await response.json();

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save userId (very important for dashboard.js)
        // Your backend should return userId in login response.
        if (data.userId) {
            localStorage.setItem("userId", data.userId);
        }

        // Debugging
        console.log("Token saved:", data.token);
        console.log("User ID saved:", data.userId);

        // Redirect to dashboard
        window.location.href = "/dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to server.");
    }
}