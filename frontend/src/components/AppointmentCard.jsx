function AppointmentCard({
  patientName,
  doctorName,
  date,
  timeSlot,
  status
}) {
  return (
    <div className={`appointment-card ${status}`}>
      <h3>Appointment</h3>

      <p><strong>Patient:</strong> {patientName}</p>
      <p><strong>Doctor:</strong> {doctorName}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {timeSlot}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`status ${status}`}>{status}</span>
      </p>
    </div>
  );
}

export default AppointmentCard;