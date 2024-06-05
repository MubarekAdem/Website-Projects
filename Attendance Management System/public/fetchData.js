// fetchData.js
document.addEventListener('DOMContentLoaded', async () => {
  const dataTable = document.getElementById('dataTable');

  try {
    const response = await fetch('/api/fetchData');
    const data = await response.json();

    data.forEach(item => {
      const row = dataTable.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      

      // Add content to cells
      cell1.textContent = item.STUDENT_NAME;
      cell2.textContent = item.STUDENT_ID;
      cell3.textContent = item.ATTENDANCE_STATUS;
      
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
