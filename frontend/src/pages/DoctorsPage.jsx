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
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading doctors...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div>
      <h1>Doctors</h1>

      {doctors.map((doctor) => (
        <div key={doctor.id}>
          <h2>{doctor.name}</h2>
          <p>Email: {doctor.email}</p>
          <p>Specialisation: {doctor.specialisation}</p>
          <p>
            Availability:{" "}
            {doctor.available ? "Available" : "Not Available"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DoctorsPage;