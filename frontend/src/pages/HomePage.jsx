import AppointmentCard from "../components/AppointmentCard";

function HomePage() {
  return (
    <div>
      <h1>MedCare Plus Hospital</h1>
      <p>Hospital Appointment System</p>

      <AppointmentCard
        patientName="Rahul"
        doctorName="Dr. Sharma"
        date="2026-08-20"
        timeSlot="10:00 AM"
        status="confirmed"
      />
    </div>
  );
}

export default HomePage;