document.addEventListener('DOMContentLoaded', async () => {
  const attendanceTable = document.getElementById('attendanceTable');
  const attendanceData = document.getElementById('attendanceData');

  try {
    // Fetch attendance data
    const response = await fetch('/api/fetchAttendance');
    const data = await response.json();

    // Populate table with attendance data
    data.forEach(item => {
      const row = attendanceData.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);

      cell1.textContent = item.STUDENT_NAME;
      cell2.textContent = item.STUDENT_ID;
      cell3.textContent = item.ATTENDANCE_STATUS;
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
  }
});
