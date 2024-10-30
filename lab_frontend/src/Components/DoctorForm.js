import React, { useState, useEffect } from 'react';
import './DoctorForm.css';

function DoctorForm() {
    const [testValues, setTestValues] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/test-values/')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data); // Inspect data structure
                setTestValues(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleApproveAll = (patientId) => {
        fetch(`http://127.0.0.1:8000/test-values/${patientId}/approve-all/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ approve: true }),
        })
            .then(response => response.json())
            .then(() => {
                // Update local state to reflect approval
                setTestValues(prevValues => 
                    prevValues.map(test => 
                        test.patient_id === patientId
                            ? {
                                ...test,
                                testdetails: test.testdetails.map(detail => ({
                                    ...detail,
                                    approve: true // Approve all test details
                                })),
                                approve: true // Set approve status for the patient
                            }
                            : test
                    )
                );
            })
            .catch(error => console.error('Error updating data:', error));
    };

    const handleRerun = (patientId, testIndex) => {
        fetch(`http://127.0.0.1:8000/test-values/${patientId}/${testIndex}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rerun: true }),
        })
            .then(response => response.json())
            .then(() => {
                // Update local state to reflect rerun status
                setTestValues(prevValues => {
                    const newValues = [...prevValues];
                    const testToUpdate = newValues.find(test => test.patient_id === patientId);
                    if (testToUpdate) {
                        testToUpdate.testdetails[testIndex].rerun = true; // Set rerun to true
                    }
                    return newValues;
                });
            })
            .catch(error => console.error('Error updating data:', error));
    };

    return (
        <div className="doctor-form">
            <h2 className="title">Shanmuga Diagnosis</h2>
            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Sl. No</th>
                        <th>Patient ID</th>
                        <th>Patient Name</th>
                        <th>Age</th>
                        <th>Date</th>
                        <th>Test Name</th>
                        <th>Specimen Type</th>
                        <th>Unit</th>
                        <th>Value</th>
                        <th>Reference Range</th>
                        <th>Rerun</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {testValues.map((test, testIndex) => (
                        <React.Fragment key={testIndex}>
                            {test.testdetails.map((detail, index) => (
                                <tr key={index}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={test.testdetails.length}>{testIndex + 1}</td>
                                            <td rowSpan={test.testdetails.length}>{test.patient_id}</td>
                                            <td rowSpan={test.testdetails.length}>{test.patientname}</td>
                                            <td rowSpan={test.testdetails.length}>{test.age}</td>
                                            <td rowSpan={test.testdetails.length}>{test.date}</td>
                                        </>
                                    )}
                                    <td>{detail.testname}</td>
                                    <td>{detail.specimen_type}</td>
                                    <td>{detail.unit}</td>
                                    <td>{detail.value}</td>
                                    <td>{detail.reference_range}</td>
                                    <td>
                                        <button 
                                            className="action-button rerun-button"
                                            onClick={() => handleRerun(test.patient_id, index)}
                                            disabled={detail.approve || detail.rerun} // Disable if approved or already rerun
                                        >
                                            {detail.rerun ? "Rerun Initiated" : "Rerun"}
                                        </button>
                                    </td>
                                    {index === 0 && (
                                        <td rowSpan={test.testdetails.length}>
                                            <button 
                                                className="action-button approve-button"
                                                onClick={() => handleApproveAll(test.patient_id)}
                                                disabled={test.testdetails.every(d => d.approve) || test.testdetails.some(d => d.rerun)} // Disable if all are approved or any are rerun
                                            >
                                                {test.testdetails.every(d => d.approve) ? "Approved" : "Approve"}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DoctorForm;