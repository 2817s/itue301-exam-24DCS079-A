import { useEffect, useState } from "react";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/doctors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        return response.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load doctors");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading doctors...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <main className="doctors-page">
      <h1>Doctors</h1>

      {doctors.length === 0 ? (
        <p className="empty">No doctors found in the database.</p>
      ) : (
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div
              className="doctor-card"
              key={doctor._id || doctor.id}
            >
              <h2>{doctor.name}</h2>

              <p>
                <strong>Email:</strong> {doctor.email}
              </p>

              <p>
                <strong>Specialisation:</strong>{" "}
                {doctor.specialisation}
              </p>

              <p
                className={
                  doctor.available ? "available" : "unavailable"
                }
              >
                Status:{" "}
                {doctor.available ? "Available" : "Not Available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default DoctorsPage;