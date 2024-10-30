import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Report.css';

function Report() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [hoveredTest, setHoveredTest] = useState(null); // State for hovered test

    const fetchReport = async () => {
        if (selectedDate) {
            const day = selectedDate.getDate();
            const month = selectedDate.getMonth() + 1;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/test-report/?day=${day}&month=${month}`);
                setReportData(response.data.data || []);
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        }
    };

    return (
        <div className="report-container">
            <h2>Test Report</h2>
            <div className="date-picker-container">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                />
                <button onClick={fetchReport} className="fetch-button">Get Report</button>
            </div>

            {reportData.length > 0 ? (
                <div className="table-container">
                    <h5>Report Data</h5>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Patient Name</th>
                                <th>Age</th>
                                <th>Date</th>
                                <th>Test Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.patient_id}</td>
                                    <td>{data.patientname}</td>
                                    <td>{data.age}</td>
                                    <td>{data.date}</td>
                                    <td>
                                        {data.testdetails.map((test, idx) => (
                                            <div 
                                                key={idx} 
                                                className="test-detail"
                                                onMouseEnter={() => setHoveredTest(idx)} // Set hovered test on mouse enter
                                                onMouseLeave={() => setHoveredTest(null)} // Clear hovered test on mouse leave
                                            >
                                                <p className="test-name"><strong>Test Name:</strong> {test.testname}</p>
                                                {hoveredTest === idx && ( // Show details only if the test is hovered
                                                    <div className="test-details">
                                                        <p><strong>Specimen Type:</strong> {test.specimen_type}</p>
                                                        <p><strong>Unit:</strong> {test.unit}</p>
                                                        <p><strong>Value:</strong> {test.value}</p>
                                                        <p><strong>Reference Range:</strong> {test.reference_range}</p>
                                                    </div>
                                                )}
                                                <hr />
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">No report data available.</p>
            )}
        </div>
    );
}

export default Report;
