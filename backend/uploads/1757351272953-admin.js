document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Simple validation check
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
  
    // For demonstration, log the credentials (don't do this in production)
    console.log("Username:", username);
    console.log("Password:", password);
  
    // Check for hardcoded credentials (for demonstration purposes)
    if (username === "admin" && password === "admin123") {
      alert("Login successful!");
      // Redirect to admin dashboard or the desired page
      window.location.href = "admin_dashboard.html"; // Change this URL as needed
    } else {
      alert("Invalid username or password. Please try again.");
    }
  
  });
  