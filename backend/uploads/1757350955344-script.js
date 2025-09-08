// script.js

// Example function to load reports dynamically
function loadReports() {
  const reportsContainer = document.getElementById('reports-container');
  const sampleReports = [
    { id: 1, type: 'No Helmet', status: 'In Process' },
    { id: 2, type: 'Wrong Parking', status: 'Approved' },
    { id: 3, type: 'Signal Jumping', status: 'Rejected' }
  ];

  // Clear container before loading reports
  reportsContainer.innerHTML = '';

  sampleReports.forEach(report => {
    const reportDiv = document.createElement('div');
    reportDiv.classList.add('report');
    reportDiv.innerHTML = `
      <p><strong>Type:</strong> ${report.type}</p>
      <p><strong>Status:</strong> ${report.status}</p>
    `;
    reportsContainer.appendChild(reportDiv);
  });
}

// Load sample reports on page load
window.onload = loadReports;







