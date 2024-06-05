const sql = require("mssql"); // Import the mssql package
const bodyParser = require("body-parser");

// app.js
const express = require("express");
const path = require("path");
const { connect, pool } = require("./db");
const { error } = require("console");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

//display admin page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fetchAttendance.html"));
});

// ...

app.get("/api/fetchData", async (req, res) => {
  try {
    const studentRequest = pool.request();
    const studentResult = await studentRequest.query(
      "SELECT student_id, student_name FROM Students"
    );

    const attendanceRequest = pool.request();
    const attendanceResult = await attendanceRequest.query(
      "SELECT Students.student_id, Students.student_name, Attendance.attendance_status FROM Students JOIN Attendance ON Students.student_id = Attendance.student_id WHERE Attendance.attendance_date = ATTENDANCE_DATE"
    );

    const combinedData = {
      students: studentResult.recordset,
      attendance: attendanceResult.recordset,
    };

    res.json(combinedData);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ...
// Existing app.get('/api/fetchData', ...) route
app.get("/api/fetchData", async (req, res) => {
  try {
    // Your existing code for fetching general data

    // ...

    res.json(combinedData);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Updated app.get('/api/fetchData', ...) route to handle attendance filtering
app.get("/api/fetchData", async (req, res) => {
  try {
    const attendanceDate = req.query.attendanceDate;
    const attendanceStatus = req.query.attendanceStatus;

    if (attendanceDate && attendanceStatus) {
      // Your code for fetching attendance based on date and status

      // ...

      res.json(attendanceData);
    } else {
      // Your existing code for fetching general data

      // ...

      res.json(combinedData);
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//..........................................

app.post("/api/postData", async (req, res) => {
  const attendanceDate = req.body.attendance_date;
  const selectedStudents = req.body.selectedStudents;

  try {
    for (const studentId in selectedStudents) {
      const attendanceStatus = selectedStudents[studentId];

      // Your logic to insert data into the database goes here
      // Assuming you have a function called 'insertAttendance' in your db module
      await insertAttendance(studentId, attendanceDate, attendanceStatus);
    }

    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Assume you have a function in your db module for inserting attendance
async function insertAttendance(studentId, attendanceDate, attendanceStatus) {
  try {
    const request = pool.request();
    request.input("studentId", sql.Int, studentId);
    request.input("attendanceDate", sql.Date, attendanceDate);
    request.input("attendanceStatus", sql.NVarChar, attendanceStatus);

    const result = await request.query(`
      INSERT INTO Attendance (student_id, attendance_date, attendance_status)
      VALUES (@studentId, @attendanceDate, @attendanceStatus)
    `);

    console.log(`Attendance inserted for student ${studentId}`);
  } catch (error) {
    console.error("Error inserting attendance:", error);
    throw error;
  }
}

app.get("/attendance", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fetchAttendance.html"));
});

// Fetch general data
app.get("/api/fetchData", async (req, res) => {
  try {
    const studentRequest = pool.request();
    const studentResult = await studentRequest.query(
      "SELECT student_id, student_name FROM Students"
    );

    const combinedData = {
      students: studentResult.recordset,
      attendance: [], // Placeholder for attendance data
    };

    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching general data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch attendance data
// Add this route to your Express app
app.get("/api/fetchAttendanceRecords", async (req, res) => {
  const { date } = req.query;

  try {
    const request = pool.request();
    const result = await request.query(`
      SELECT Students.student_name, Students.student_id, Attendance.attendance_status
      FROM Students
      LEFT JOIN Attendance ON Students.student_id = Attendance.student_id AND Attendance.attendance_date = '${date}'
    `);

    const attendanceRecords = result.recordset;
    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... existing code ...

// ...

app.get("/api/fetchAttendanceSum", async (req, res) => {
  const { beginDate, endDate } = req.query;

  try {
    const request = pool.request();
    const result = await request.query(`
      SELECT
        Students.student_id,
        Students.student_name,
        SUM(CASE WHEN Attendance.attendance_status = 'Present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN Attendance.attendance_status = 'Absent' THEN 1 ELSE 0 END) AS absent_count
      FROM Students
      LEFT JOIN Attendance ON Students.student_id = Attendance.student_id
      WHERE Attendance.attendance_date BETWEEN '${beginDate}' AND '${endDate}'
      GROUP BY Students.student_id, Students.student_name
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ...

// Fetch attendance summary for a specific date

// ...

// ...

// ...

app.delete("/api/deleteData", async (req, res) => {});

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
