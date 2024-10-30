import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [b2bNames, setB2bNames] = useState([]);
  const [selectedB2b, setSelectedB2b] = useState("");
  const [overallTotalAmount, setOverallTotalAmount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [balances, setBalances] = useState({});
  const [editBalanceId, setEditBalanceId] = useState(null); // State to track which balance is being edited

  // Fetch all patients data
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/all-patients/')
      .then(response => {
        const data = response.data;
        setPatients(data);
        setFilteredPatients(data);

        // Get unique B2B names for the select dropdown
        const uniqueB2bNames = [...new Set(data.map(patient => patient.B2B))];
        setB2bNames(uniqueB2bNames);

        // Initialize balances state
        const initialBalances = {};
        data.forEach(patient => {
          initialBalances[patient.patientId] = calculateBalance(patient).toFixed(2);
        });
        setBalances(initialBalances);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Calculate the overall total amount based on filtered patients
  useEffect(() => {
    const totalAmount = filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.totalAmount) || 0), 0);
    setOverallTotalAmount(totalAmount);
  }, [filteredPatients]);

  // Filter data based on selected B2B name and date range
  const handleB2bChange = (event) => {
    const b2bName = event.target.value;
    setSelectedB2b(b2bName);
    filterPatients(b2bName, startDate, endDate);
  };

  const filterPatients = (b2bName, start, end) => {
    let filtered = patients;

    if (b2bName) {
      filtered = filtered.filter(patient => patient.B2B === b2bName);
    }
    
    if (start && end) {
      filtered = filtered.filter(patient => {
        const patientDate = new Date(patient.date);
        return patientDate >= start && patientDate <= end;
      });
    }

    setFilteredPatients(filtered);
  };

  // Handle date change
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    filterPatients(selectedB2b, start, end);
  };

  // Calculate balance for each patient
  const calculateBalance = (patient) => {
    const totalTestAmount = patient.testname.reduce((sum, test) => sum + (parseFloat(test.amount) || 0), 0);
    return (parseFloat(patient.totalAmount) || 0) - totalTestAmount;
  };

  // Handle balance input change
  const handleBalanceChange = (patientId, newBalance) => {
    setBalances(prevBalances => ({
      ...prevBalances,
      [patientId]: newBalance,
    }));
  };

  // Start editing balance on double click
  const handleDoubleClick = (patientId) => {
    setEditBalanceId(patientId);
  };

  // Handle balance input blur (end editing)
  const handleBlur = () => {
    setEditBalanceId(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Patient Data</h2>

      {/* B2B Name Select Filter */}
      <label htmlFor="b2bFilter" style={styles.label}>Filter by B2B Name: </label>
      <select id="b2bFilter" value={selectedB2b} onChange={handleB2bChange} style={styles.select}>
        <option value="">All</option>
        {b2bNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>

      {/* Date Range Picker */}
      <label style={styles.label}>Select Date Range: </label>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        isClearable={true}
        placeholderText="Select a date range"
      />

      {/* Responsive Table displaying B2B name, patient name, total amount, test names with amounts, and balance */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>B2B Name</th>
              <th style={styles.tableHeader}>Patient Name</th>
              <th style={styles.tableHeader}>Total Amount</th>
              <th style={styles.tableHeader}>Test Name</th>
              <th style={styles.tableHeader}>Test Amount</th>
              <th style={styles.tableHeader}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              patient.testname.map((test, testIndex) => (
                <tr key={`${index}-${testIndex}`} style={styles.tableRow}>
                  {testIndex === 0 && (
                    <td style={styles.tableCell} rowSpan={patient.testname.length}>{patient.B2B}</td>
                  )}
                  {testIndex === 0 && (
                    <td style={styles.tableCell} rowSpan={patient.testname.length}>{patient.patientname}</td>
                  )}
                  {testIndex === 0 && (
                    <td style={styles.tableCell} rowSpan={patient.testname.length}>
                      {patient.totalAmount}
                      {patient.balanceType === "credit" && <span style={styles.creditBalance}> (Credit Balance)</span>}
                    </td>
                  )}
                  <td style={styles.tableCell}>{test.testname}</td>
                  <td style={styles.tableCell}>{test.amount}</td>
                  {testIndex === 0 && (
                    <td style={styles.tableCell} rowSpan={patient.testname.length}>
                      {calculateBalance(patient) > 0 ? ( // Only allow editing if balance is above 0
                        editBalanceId === patient.patientId ? (
                          <input
                            type="number"
                            value={balances[patient.patientId] || 0}
                            onChange={(e) => handleBalanceChange(patient.patientId, e.target.value)}
                            onBlur={handleBlur} // End editing when input loses focus
                            style={styles.balanceInput}
                          />
                        ) : (
                          <span 
                            onDoubleClick={() => handleDoubleClick(patient.patientId)} // Start editing on double click
                            style={styles.balanceText}
                          >
                            {balances[patient.patientId] || 0}
                          </span>
                        )
                      ) : (
                        calculateBalance(patient).toFixed(2) // Display balance as text if 0 or negative
                      )}
                    </td>
                  )}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Display overall total amount below the table */}
      <div style={styles.overallTotal}>
        <strong>Overall Total Amount: </strong> {overallTotalAmount.toFixed(2)}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  label: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  select: {
    padding: '8px',
    marginBottom: '20px',
    fontSize: '16px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '8px',
    textAlign: 'left',
  },
  creditBalance: {
    color: 'green',
  },
  balanceInput: {
    width: '100%',
    padding: '4px',
  },
  balanceText: {
    cursor: 'pointer',
  },
  overallTotal: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default PatientTable;
