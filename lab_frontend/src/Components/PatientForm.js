import React, { useState, useEffect  } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import SampleCollectorForm from './SampleCollectorForm';
import AddOrganisation from './AddOrganisation';  // Import the AddOrganisation component
import { FaToggleOff,FaToggleOn,FaTrash } from "react-icons/fa";
import './PatientForm.css';
import Barcode from 'react-barcode';
const PatientForm = () => {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Formats date as YYYY-MM-DD
  };
 
  const [formData, setFormData] = useState({
    patient_id:'' ,
    date: getCurrentDate(),
    lab_id: '',
    refby: '',
    branch: '',
    B2B: '',
    home_collection: '',
    patientname: '',
    gender: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    age_type: 'Year', // Changed from 'ageType'
    sample_collector: '', // Changed from 'sampleCollector'
    organisation: '',
    testname: [],
    totalAmount:0,
    payment_method: '', // Changed from 'paymentmethod'
  });
  
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);
  const [organisationOptions, setOrganisationOptions] = useState([]);
  const [showSampleCollectorForm, setShowSampleCollectorForm] = useState(false);
  const [showAddOrganisationForm, setShowAddOrganisationForm] = useState(false);
  const [isB2BEnabled, setIsB2BEnabled] = useState(false); // State to track toggle status
  const [barcodeValue, setBarcodeValue] = useState('');
  const handleToggle = () => {
    setIsB2BEnabled(!isB2BEnabled); // Toggle the state
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Fetch sample collectors
    axios.get('http://127.0.0.1:8000/sample-collector/')
      .then(response => {
        setSampleCollectorOptions(response.data);
      })
      .catch(error => console.error('Error fetching sample collectors:', error));

    // Fetch organizations
    axios.get('http://127.0.0.1:8000/organisation/')
      .then(response => {
        setOrganisationOptions(response.data);
      })
      .catch(error => console.error('Error fetching organisations:', error));
  }, []);

  // Fetch the latest patient ID when the component is mounted
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/latest-patient-id/')
      .then(response => {
        setFormData(prevData => ({
          ...prevData,
          patient_id: response.data.patient_id,  // Set the new patient ID
        }));
      })
      .catch(error => {
        console.error('Error fetching patient ID:', error);
        alert('Error loading the form. Please try again.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPatientName = `${formData.Title} ${formData.patientname}`;
    // Generate a unique barcode value (for example, using patient ID)
    const uniqueBarcode = `P${new Date().getTime()}_${formData.patient_id}_${formData.patientname}_${formData.age}`;
    setBarcodeValue(uniqueBarcode);
  
    if (!formData.patientname || !formData.phone || selectedTests.length === 0) {
      alert('Please fill in all required fields and select at least one test.');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/patient/create/', {
        ...formData,
        patientname: fullPatientName,
        testname: selectedTests,
        totalAmount: formData.totalAmount
      });
      
      alert('Patient data saved successfully!');
      
      // Reset form fields
      setFormData({
        patient_id: response.data.patient_id, // Reset patient ID to new value
        date: getCurrentDate(),
        lab_id: '',
        refby: '',
        branch: '',
        B2B: '',
        home_collection: '',
        patientname: '',
        gender: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        age_type: 'Year',
        sample_collector: '',
        organisation: '',
        testname: [],
        totalAmount: 0,
        payment_method: ''
      });
      setSelectedTests([]); // Clear selected tests
      
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };
  
  const [clinicalNames, setClinicalNames] = useState([]);
  const [filteredClinicalNames, setFilteredClinicalNames] = useState([]);

  // Fetch clinical details on component mount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/clinical-details/')
      .then((response) => {
        setClinicalNames(response.data);
        setFilteredClinicalNames(response.data); // Initially set filtered options to all
        console.log("Clinical names fetched:", response.data); // Debugging line
      })
      .catch((error) => {
        console.error('Error fetching clinical details:', error);
      });
  }, []);

  // Handle change event for clinical name input
  const handleClinicalNameChange = (e) => {
    const input = e.target.value;
    setFormData({
      ...formData,
      B2B: input
    });

    // Filter clinical names based on input
    if (input.length >= 1) {
      const filtered = clinicalNames.filter(name =>
        name["Clinical Name"]?.toLowerCase().includes(input.toLowerCase().trim())
      );
      setFilteredClinicalNames(filtered);
      console.log("Filtered names:", filtered); // Log filtered names
    } else {
      setFilteredClinicalNames([]);
    }
  };

  // Handle selection of a clinical name from suggestions
  const handleClinicalOptionClick = (selectedName) => {
    setFormData({
      ...formData,
      B2B: selectedName["Clinical Name"] // Set the selected name
    });
    setFilteredClinicalNames([]); // Hide suggestions after selection
  };

  const [formData2, setFormData2] = useState({
    testname: '',
    amount: ''
  });
  const [testOptions, setTestOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]); // State to store selected tests

  // Fetch test details on component mount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/test-details/')
      .then((response) => {
        setTestOptions(response.data);
        setFilteredOptions(response.data); // Initially set filtered options to all
        console.log("Test options fetched:", response.data); // Debugging line
      })
      .catch((error) => {
        console.error('Error fetching test details:', error);
      });
  }, []);
 
  // Handle change event for test name input
  const handleTestNameChange = (e) => {
    const input = e.target.value;
    setFormData2({
      ...formData2,
      testname: input,
      amount: '' // Clear amount whenever the test name input is changed
    });
  
    // Only filter options if input has at least one character
    if (input.length >= 1) {
      const filtered = testOptions.filter(test =>
        test["Test Name"] && test["Test Name"].toLowerCase().includes(input.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  // Handle selection of a test name from suggestions
  const handleOptionClick = (selectedTestDetail) => {
    const newTest = {
      testname: selectedTestDetail["Test Name"],
      amount: selectedTestDetail["Amount"] || 0 // Set amount if available
    };

    setSelectedTests((prev) => [
      ...prev,
      newTest
    ]); // Add selected test to the list

    setFormData2({
      testname: '', // Clear testname field
      amount: selectedTestDetail["Amount"] || '' // Set amount if available
    });

    setFilteredOptions([]); // Hide suggestions after selection
  };
// Handle deletion of a selected test
const handleDelete = (index) => {
  const updatedTests = selectedTests.filter((_, i) => i !== index);
  setSelectedTests(updatedTests);
};
// Calculate total amount
const calculateTotalAmount = () => {
  const total = selectedTests.reduce((sum, test) => sum + test.amount, 0);
  setFormData(prev => ({ ...prev, totalAmount: total }));
};

useEffect(() => {
  calculateTotalAmount();
}, [selectedTests]);
  return (
    <form onSubmit={handleSubmit} className="container mt-3">
      {/* Patient Details */}
      {/* First Row: Date, Lab ID, Ref By, Branch */}
    <div className="row mb-3">
      <div className="col-md-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          className="form-control"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Lab ID</label>
        <input
          type="text"
          className="form-control"
          name="lab_id"
          value={formData.lab_id}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Ref By</label>
        <input
          type="text"
          className="form-control"
          name="refby"
          value={formData.refby}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
    <label className="form-label">Branch</label>
    <select
      className="form-select"
      name="branch"
      value={formData.branch}
      onChange={handleChange}
    >
      <option value="">Select a Branch</option> {/* Placeholder option */}
      <option value="Mother Lab">Mother Lab</option> {/* Adding Mother Lab option */}
        
    </select>
  </div>
  </div>

     {/* Second Row: B2B, Home Collection */}
     <div className="row mb-3">
      <div className="col-md-2 text-center"> {/* Centering the contents */}
      <label className="form-label mt-2">B2B</label> {/* Moved the label below the icon */}

        <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
          {isB2BEnabled ? (
            <FaToggleOn className="ms-2" style={{ fontSize: '40px', color: 'green' }} />
          ) : (
            <FaToggleOff className="ms-2" style={{ fontSize: '40px', color: 'grey' }} />
          )}
        </div>
      </div>
      <div className="col-md-4">
        <label className="form-label">Clinical Name</label>
        <input
          type="text"
          className="form-control"
          name="B2B"
          value={formData.B2B}
          onChange={handleClinicalNameChange}
          placeholder="Type Clinical Name"
        />
        
        {/* Suggestions Dropdown */}
        {formData.B2B.length > 0 && filteredClinicalNames.length > 0 && (
          <div
            className="dropdown-menu show"
            style={{
              maxHeight: '150px',
              overflowY: 'auto',
              position: 'absolute',
              zIndex: 1000,
            }}
          >
            {filteredClinicalNames.map((name, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleClinicalOptionClick(name)}
              >
                {name["Clinical Name"]} {/* Ensure only the Clinical Name is rendered */}
              </button>
            ))}
          </div>
        )}
        
        {filteredClinicalNames.length === 0 && formData.B2B && (
          <div className="text-danger">No clinical name found.</div>
        )}
      </div>

      <div className="col-md-4">
        <label className="form-label">Home Collection</label>
        <input
          type="text"
          className="form-control"
          name="home_collection"
          value={formData.home_collection}
          onChange={handleChange}
        />
      </div>
    </div>

{/* Third Row: Patient ID, Title, Patient Name, Age, Age Type */}
<div className="row mb-3">
  {/* Patient ID */}
  <div className="col-md-3">
    <label className="form-label">Patient ID</label>
    <input
      type="text"
      className="form-control"
      name="patient_id"
      value={formData.patient_id}
      readOnly // Make it non-editable
    />
  </div>

  {/* Title */}
  <div className="col-md-2">
    <label className="form-label">Title</label>
    <select
      className="form-select"
      name="Title"
      value={formData.Title}
      onChange={handleChange}
    >
      <option>MR</option>
      <option>MRS</option>
      <option>MS</option>
      <option>MASTER</option>
      <option>MISS</option>
      <option>DR</option>
      <option>KUMAR</option>
      <option>KUMARI</option>
      <option>BABY</option>
    </select>
  </div>

  {/* Patient Name */}
  <div className="col-md-3">
    <label className="form-label">Patient Name</label>
    <input
      type="text"
      className="form-control"
      name="patientname"
      value={formData.patientname}
      onChange={handleChange}
    />
  </div>

  {/* Age */}
  <div className="col-md-2">
    <label className="form-label">Age</label>
    <input
      type="text"
      className="form-control"
      name="age"
      value={formData.age}
      onChange={handleChange}
    />
  </div>
    {/* Age Type */}
    <div className="col-md-2">
    <label className="form-label">Age Type</label>
    <select
      className="form-select"
      name="age_type" // Ensure the name matches formData
      value={formData.age_type}
      onChange={handleChange}
    >
      <option>Year</option>
      <option>Month</option>
      <option>Day</option>
    </select>
  </div>
</div>

{/* Fourth Row: Gender, Phone Number, Email ID, Address */}
<div className="row mb-3">

  {/* Gender */}
  <div className="col-md-4">
    <label className="form-label">Gender</label>
    <div>
      <input
        type="radio"
        name="gender"
        value="male"
        checked={formData.gender === 'male'}
        onChange={handleChange}
      /> Male
      <input
        type="radio"
        name="gender"
        value="female"
        className="ms-2"
        checked={formData.gender === 'female'}
        onChange={handleChange}
      /> Female
      <input
        type="radio"
        name="gender"
        value="other"
        className="ms-2"
        checked={formData.gender === 'other'}
        onChange={handleChange}
      /> Other
    </div>
  </div>

  {/* Phone Number */}
  <div className="col-md-4">
    <label className="form-label">Phone Number</label>
    <input
      type="text"
      className="form-control"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      required
    />
  </div>

  {/* Email ID */}
  <div className="col-md-4">
    <label className="form-label">Email ID</label>
    <input
      type="email"
      className="form-control"
      name="email"
      value={formData.email}
      onChange={handleChange}
    />
  </div>
  </div>

  <div className="row mb-3">
    {/* Address Row */}
    <div className="col-md-4">
    <label className="form-label">Address</label>
    <input
      className="form-control"
      name="address"
      value={formData.address}
      onChange={handleChange}
    />
  </div>
  {/* Select Sample Collector */}
  <div className="col-md-4">
    <label className="form-label">Select Sample Collector</label>
    <div className="d-flex align-items-center">
      <select
        className="form-select me-2"
        name="sample_collector"
        value={formData.sample_collector}
        onChange={handleChange}
      >
        <option value="">Select Sample Collector</option>
        {sampleCollectorOptions.map((collector, index) => (
          <option key={index} value={collector.id}>
            {collector.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => setShowSampleCollectorForm(true)}
      >
        <i className="fa fa-plus"></i> +
      </button>
    </div>
    <SampleCollectorForm show={showSampleCollectorForm} setShow={setShowSampleCollectorForm} />
  </div>

  {/* Select Organisation */}
  <div className="col-md-4">
    <label className="form-label">Select Organisation</label>
    <div className="d-flex align-items-center">
      <select
        className="form-select me-2"
        name="organisation"
        value={formData.organisation}
        onChange={handleChange}
      >
        <option value="">Select Organisation</option>
        {organisationOptions.map((organisation, index) => (
          <option key={index} value={organisation.id}>
            {organisation.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => setShowAddOrganisationForm(true)}
      >
        <i className="fa fa-plus"></i> +
      </button>
    </div>
    <AddOrganisation show={showAddOrganisationForm} setShow={setShowAddOrganisationForm} />
  </div>
</div>

<h3>Billing</h3>
<br/>
{/* Sixth Row: Test Name, Amount */}
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Test Name</label>
          <input
            type="text"
            className="form-control"
            name="testname"
            value={formData2.testname}
            onChange={handleTestNameChange}
            placeholder="Type Test Name"
          />
          
          {/* Suggestions Dropdown */}
          {formData2.testname.length > 0 && filteredOptions.length > 0 && (
            <div 
              className="dropdown-menu show" 
              style={{
                width: '80%', // Set to a smaller width
                maxHeight: '150px', 
                overflowY: 'auto',
                position: 'absolute', 
                zIndex: 1000
              }}
            >
              {filteredOptions.map((option, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleOptionClick(option)}
                >
                  {option["Test Name"]}
                </button>
              ))}
            </div>
          )}
          
          {filteredOptions.length === 0 && formData2.testname && (
            <div className="text-danger">No test found.</div>
          )}
        </div>

        {/* <div className="col-md-6">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={formData2.amount}
            readOnly // Making the amount field read-only as it's auto-filled
          />
        </div> */}
      </div>

     {/* Table to display selected tests */}
      <table className="table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Amount</th>
              <th>Action</th> {/* Add Action column for delete icon */}
            </tr>
          </thead>
          <tbody>
          {selectedTests.map((test, index) => (
            <tr key={index}>
              <td>{test.testname}</td>
              <td>{test.amount}</td>
              <td>
                <button type="button" onClick={() => handleDelete(index)}className="btn btn-danger btn-sm">
                <FaTrash /> {/* Delete icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

    {/* Total Amount Display */}
    <div className="row mb-3">
          <div className="col-md-3 offset-md-9 text-end">
              <label className="form-label">Total Amount</label>
              <input
                type="text"
                className="form-control"
                value={formData.totalAmount}
                readOnly // Make it non-editable
              />
            </div>
          </div>
      {/* Conditionally render the payment method section */}
      {selectedTests.length > 0 && (
          <div className="mb-3">
            <div className="col-md-3 text-start">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>
          </div>
        )}
      </div>
      <button type="submit" className="btn btn-primary">Go to Billing</button>
      {barcodeValue && (
                <div>
                    <h3>Generated Barcode:</h3>
                    <Barcode value={barcodeValue} />
                </div>
            )}
    </form>
  );
};

export default PatientForm;