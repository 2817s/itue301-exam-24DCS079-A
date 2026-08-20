const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Global middleware
app.use(express.json());
app.use(cors());

// In-memory appointments
let appointments = [
  {
    id: 1,
    patientName: "Rahul",
    doctorName: "Dr. Sharma",
    date: "2026-08-20",
    timeSlot: "10:00 AM",
    status: "confirmed",
    reason: "Regular checkup"
  }
];

// In-memory doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sharma",
    email: "sharma@medcare.com",
    specialisation: "Cardiologist",
    available: true
  },
  {
    id: 2,
    name: "Dr. Patel",
    email: "patel@medcare.com",
    specialisation: "Dermatologist",
    available: true
  },
  {
    id: 3,
    name: "Dr. Mehta",
    email: "mehta@medcare.com",
    specialisation: "Neurologist",
    available: false
  }
];

// Request Logger Middleware
const requestLogger = (req, res, next) => {
  console.log(
    `[${req.method}] ${req.path} [${new Date().toISOString()}]`
  );

  next();
};

// Apply logger globally
app.use(requestLogger);

// GET all appointments
app.get("/api/v1/appointments", (req, res) => {
  res.status(200).json(appointments);
});

// POST new appointment
app.post("/api/v1/appointments", (req, res) => {
  const {
    patientName,
    doctorName,
    date,
    timeSlot,
    status,
    reason
  } = req.body;

  const newAppointment = {
    id: appointments.length + 1,
    patientName,
    doctorName,
    date,
    timeSlot,
    status: status || "pending",
    reason
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
});

// GET all doctors
app.get("/api/v1/doctors", (req, res) => {
  res.status(200).json(doctors);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});