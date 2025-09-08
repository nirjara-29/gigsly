// Booking slot functionality
const scheduleForm = document.getElementById('scheduleForm');
scheduleForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get the selected service, slot, and date
  const service = document.getElementById('service').value;
  const slot = document.getElementById('slot').value;
  const dateInput = document.getElementById('date').value;

  if (dateInput) {
    // Convert date to dd-mm-yyyy format
    const date = new Date(dateInput);
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

    alert(`Your laundry slot has been booked!\nService: ${service}\nSlot: ${slot}\nDate: ${formattedDate}`);
    setReminder(dateInput, slot, service);
  } else {
    alert("Please select a date to book your slot.");
  }
});

// Cost Estimator functionality
const costForm = document.getElementById('costForm');
costForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const washType = document.getElementById('washType').value;
  const numClothes = parseInt(document.getElementById('numClothes').value);
  let costPerCloth;

  // Define costs per cloth for different wash types
  switch (washType) {
    case 'Normal Wash':
      costPerCloth = 5;
      break;
    case 'Dry Cleaning':
      costPerCloth = 15;
      break;
    case 'Normal Wash + Iron':
      costPerCloth = 10;
      break;
    case 'Only Iron':
      costPerCloth = 3;
      break;
    default:
      costPerCloth = 0;
  }

  const totalCost = numClothes * costPerCloth;
  document.getElementById('costOutput').innerText = `Estimated cost: ${totalCost} Rs.`;
});

// Reminder functionality (Push Notification)
function setReminder(date, slot, service) {
  const reminderTime = new Date(date);
  reminderTime.setHours(7, 0, 0); // Set reminder to 7:00 AM of the selected day

  const currentTime = new Date();
  const timeDifference = reminderTime - currentTime;

  if (timeDifference > 0) {
    setTimeout(() => {
      alert(`Reminder: Your laundry slot is booked with ${service} for ${slot} on ${date}.`);
    }, timeDifference);
  } else {
    alert('The selected time has already passed, please choose a future date.');
  }
}
