import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import './PatientDetails.css';
import { FaUser, FaIdBadge, FaBirthdayCake } from 'react-icons/fa';

function PatientDetails() {
  const [patientDetails, setPatientDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientDetails(selectedDate);
  }, [selectedDate]);

  const fetchPatientDetails = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    axios.get(`http://127.0.0.1:8000/patients/?date=${formattedDate}`)
      .then(response => setPatientDetails(response.data.data))
      .catch(error => console.error('Error fetching patient details:', error));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchPatientDetails(date);
  };

  const handlePatientClick = (patientId) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    navigate(`/Technician/TestDetails?patient_id=${patientId}&date=${formattedDate}`);
  };

  return (
    <div className="patient-details-container">
      <h2>Patient Test Details</h2>
      <div className="date-picker">
        <label>Select Date:</label>
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
      </div>

      {patientDetails.length === 0 ? (
        <div className="no-data">No patient details available for the selected date.</div>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th><FaIdBadge className="icon" /> Patient ID</th>
              <th><FaUser className="icon" /> Name</th>
              <th><FaBirthdayCake className="icon" /> Age</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody>
            {patientDetails.map((patient, index) => (
              <tr key={index} className="patient-row">
                <td>{patient.patient_id}</td>
                <td>{patient.patientname}</td>
                <td>{patient.age} years</td>
                <td><button onClick={() => handlePatientClick(patient.patient_id)}>Go To Test</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientDetails;
