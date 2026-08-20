import { useEffect, useState } from "react";

function BookingPage() {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    bloodGroup: "",
    age: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // LOAD DOCTORS
  // ================================

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/doctors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }

        return response.json();
      })
      .then((data) => {
        setDoctors(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load doctors");
      });
  }, []);

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // SUBMIT APPOINTMENT
  // ================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // --------------------------------
      // 1. CREATE PATIENT
      // --------------------------------

      const patientResponse = await fetch(
        "http://localhost:5000/api/v1/patients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.patientName,
            email: formData.patientEmail,
            phone: formData.patientPhone,
            bloodGroup: formData.bloodGroup,
            age: Number(formData.age),
          }),
        }
      );

      const patientData = await patientResponse.json();

      if (!patientResponse.ok) {
        throw new Error(
          patientData.errors?.join(", ") ||
            patientData.message ||
            "Failed to create patient"
        );
      }

      // --------------------------------
      // 2. CREATE APPOINTMENT
      // --------------------------------

      const appointmentResponse = await fetch(
        "http://localhost:5000/api/v1/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: patientData.patient._id,
            doctorId: formData.doctorId,
            date: formData.date,
            timeSlot: formData.timeSlot,
            reason: formData.reason,
          }),
        }
      );

      const appointmentData = await appointmentResponse.json();

      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData.errors?.join(", ") ||
            appointmentData.message ||
            "Failed to create appointment"
        );
      }

      // --------------------------------
      // SUCCESS
      // --------------------------------

      setMessage(
        "Appointment booked successfully!"
      );

      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        bloodGroup: "",
        age: "",
        doctorId: "",
        date: "",
        timeSlot: "",
        reason: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <h1>Book Appointment</h1>

      <form onSubmit={handleSubmit}>
        {/* PATIENT NAME */}

        <label htmlFor="patientName">
          Patient Name
        </label>

        <input
          id="patientName"
          name="patientName"
          type="text"
          value={formData.patientName}
          onChange={handleChange}
          required
        />

        {/* EMAIL */}

        <label htmlFor="patientEmail">
          Email
        </label>

        <input
          id="patientEmail"
          name="patientEmail"
          type="email"
          value={formData.patientEmail}
          onChange={handleChange}
          required
        />

        {/* PHONE */}

        <label htmlFor="patientPhone">
          Phone
        </label>

        <input
          id="patientPhone"
          name="patientPhone"
          type="tel"
          value={formData.patientPhone}
          onChange={handleChange}
        />

        {/* BLOOD GROUP */}

        <label htmlFor="bloodGroup">
          Blood Group
        </label>

        <select
          id="bloodGroup"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">
            Select blood group
          </option>

          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        {/* AGE */}

        <label htmlFor="age">
          Age
        </label>

        <input
          id="age"
          name="age"
          type="number"
          min="1"
          max="120"
          value={formData.age}
          onChange={handleChange}
          required
        />

        {/* DOCTOR */}

        <label htmlFor="doctorId">
          Doctor
        </label>

        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">
            Select a doctor
          </option>

          {doctors.map((doctor) => (
            <option
              key={doctor._id}
              value={doctor._id}
              disabled={!doctor.available}
            >
              {doctor.name} - {doctor.specialisation}
              {!doctor.available
                ? " (Unavailable)"
                : ""}
            </option>
          ))}
        </select>

        {/* DATE */}

        <label htmlFor="date">
          Date
        </label>

        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* TIME */}

        <label htmlFor="timeSlot">
          Time Slot
        </label>

        <input
          id="timeSlot"
          name="timeSlot"
          type="text"
          placeholder="e.g. 10:00 AM"
          value={formData.timeSlot}
          onChange={handleChange}
          required
        />

        {/* REASON */}

        <label htmlFor="reason">
          Reason
        </label>

        <textarea
          id="reason"
          name="reason"
          maxLength="300"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
        />

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Booking..."
            : "Book Appointment"}
        </button>
      </form>

      {/* SUCCESS */}

      {message && (
        <div className="entered-details">
          <h2>{message}</h2>
          <p>
            Your appointment has been saved
            successfully in MongoDB.
          </p>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="entered-details">
          <h2>Booking Failed</h2>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}

export default BookingPage;