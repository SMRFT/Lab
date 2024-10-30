import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestDetails.css';
import { useLocation } from 'react-router-dom';

function TestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [values, setValues] = useState({});
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patient_id');
  const date = queryParams.get('date');

  useEffect(() => {
    if (patientId && date) {
      fetchTestDetails(patientId, date);
    }
  }, [patientId, date]);

  const fetchTestDetails = async (patientId, selectedDate) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/compare_test_details/?patient_id=${patientId}&date=${selectedDate}`);
      console.log('API Response:', response.data);

      const tests = response.data.data || [];
      setTestDetails(tests);
      
      // Initialize values for each test
      setValues(tests.reduce((acc, test) => {
        acc[test.testname] = "";  // Initialize each testname with empty string
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  const handleValueChange = (testname, event) => {
    setValues(prevValues => ({ ...prevValues, [testname]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const testDetailsData = testDetails.map(test => ({
      testname: test.testname,
      specimen_type: test.specimen_type,
      unit: test.unit,
      value: values[test.testname],
      reference_range: test.reference_range,
      rerun: false,
    }));
  
    const payload = {
      patient_id: patientId,
      date: date,
      testdetails: testDetailsData,
    };
  
    try {
      await axios.post('http://127.0.0.1:8000/test-value/save/', payload);
      console.log('All test details saved successfully');
    } catch (error) {
      console.error('Error saving test details:', error);
    }
  };
  

  return (
    <div className="test-details-container">
      <h2>Test Details for Patient ID: {patientId}</h2>

      {testDetails.length === 0 ? (
        <div>No test details available for the selected patient.</div>
      ) : (
        <form className="test-details-form" onSubmit={handleSubmit}>
          {testDetails.map((test, index) => (
            <div className="test-info" key={index}>
              <div className="form-row">
                <div className="form-group">
                  <label>Test Name:</label>
                  <input type="text" value={test.testname} readOnly className="readonly-field" />
                </div>
                <div className="form-group">
                  <label>Specimen Type:</label>
                  <input type="text" value={test.specimen_type || 'N/A'} readOnly className="readonly-field" />
                </div>
                <div className="form-group">
                  <label>Unit:</label>
                  <input type="text" value={test.unit || 'N/A'} readOnly className="readonly-field" />
                </div>
                <div className="form-group">
                  <label>Value(s):</label>
                  <input
                    type="text"
                    value={values[test.testname] || ''}
                    onChange={(e) => handleValueChange(test.testname, e)}
                    placeholder="Enter value"
                  />
                </div>
                <div className="form-group">
                  <label>Reference Range:</label>
                  <input type="text" value={test.reference_range || 'N/A'} readOnly className="readonly-field" />
                </div>
              </div>
            </div>
          ))}
          <div className="button-container">
            <button type="submit" className="submit-button">Save Value</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TestDetails;
