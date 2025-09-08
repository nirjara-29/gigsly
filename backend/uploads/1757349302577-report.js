document.getElementById("violation-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get values from the form
    const violationType = document.getElementById("violation-type").value;
    const description = document.getElementById("description").value;
    const photo = document.getElementById("photo").files[0];
  
    // Validation check
    if (!violationType || !description || !photo) {
      alert("Please fill out all fields and upload a photo.");
      return;
    }
  
    // Form data object
    const formData = new FormData();
    formData.append("violation-type", violationType);
    formData.append("description", description);
    formData.append("photo", photo);
  
    // For demonstration purposes, log the form data
    console.log("Form Data:");
    console.log("Violation Type:", violationType);
    console.log("Description:", description);
    console.log("Photo:", photo);
  
    // You would normally send the form data to the server here
    // Example using fetch API to send data to the server (replace the URL with your backend endpoint)
    fetch("your-backend-endpoint", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);
        alert("Your report has been submitted successfully!");
        // Optionally redirect the user after submission
        window.location.href = "index.html"; // Redirect to the homepage or wherever
      })
      .catch((error) => {
        console.error("Error submitting the report:", error);
        alert("There was an error submitting your report. Please try again.");
      });
  });
  