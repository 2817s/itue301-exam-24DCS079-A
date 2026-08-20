const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Doctor = require("./models/Doctor");
const Patient = require("./models/Patient");
const Appointment = require("./models/Appointment");

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// GLOBAL MIDDLEWARE
// ================================

app.use(express.json());
app.use(cors());

// ================================
// REQUEST LOGGER
// ================================

const requestLogger = (req, res, next) => {
  console.log(
    `[${req.method}] ${req.path} [${new Date().toISOString()}]`
  );

  next();
};

app.use(requestLogger);

// ================================
// HOME / TEST ROUTE
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedCare API is running",
  });
});

// ================================
// DOCTOR ROUTES
// ================================

// GET all doctors
app.get("/api/v1/doctors", async (req, res, next) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
});

// Seed doctors
app.post("/api/v1/doctors/seed", async (req, res, next) => {
  try {
    await Doctor.deleteMany({});

    const doctors = await Doctor.insertMany([
      {
        name: "Dr. Sharma",
        email: "sharma@medcare.com",
        specialisation: "Cardiologist",
        available: true,
      },
      {
        name: "Dr. Patel",
        email: "patel@medcare.com",
        specialisation: "Dermatologist",
        available: true,
      },
      {
        name: "Dr. Mehta",
        email: "mehta@medcare.com",
        specialisation: "Neurologist",
        available: false,
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Doctors seeded successfully",
      doctors,
    });
  } catch (error) {
    next(error);
  }
});

// ================================
// PATIENT ROUTES
// ================================

// Create patient
app.post("/api/v1/patients", async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
});

// GET all patients
app.get("/api/v1/patients", async (req, res, next) => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
});

// ================================
// APPOINTMENT ROUTES
// ================================

// GET all appointments
app.get("/api/v1/appointments", async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId")
      .populate("doctorId")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
});

// POST new appointment
app.post("/api/v1/appointments", async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      timeSlot,
      status,
      reason,
    } = req.body;

    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      status: status || "pending",
      reason,
    });

    const populatedAppointment = await Appointment.findById(
      newAppointment._id
    )
      .populate("patientId")
      .populate("doctorId");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use((err, req, res, next) => {
  console.error(err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}`,
    });
  }

  // Duplicate unique field
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(400).json({
      success: false,
      message: `${field || "Field"} already exists`,
    });
  }

  // General server error
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ================================
// CONNECT MONGODB + START SERVER
// ================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });