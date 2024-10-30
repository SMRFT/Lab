import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import LandingPage from './Components/LandingPage';
import Sidebar from './Components/Navbar/Sidebar'; // Your Sidebar component
import Signout from './Components/SignOut'; // Your new Signout component
import './App.css';
import TestDetailsForm from './Components/TestDetails';
import PatientForm from './Components/PatientForm';
import SampleCollectorForm from './Components/SampleCollectorForm';
import AddOrganisation from './Components/AddOrganisation';
import PatientDetails from './Components/PatientDetails';
import Report from './Components/Report';

import DoctorForm from './Components/DoctorForm';
import Invoice from './Components/Invoice';

function App() {
  const location = useLocation();

  // Paths where the sidebar should be hidden
  const hideSidebarRoutes = ['/', '/login', '/Register'];

  return (
    <div className="App">
      {/* Conditionally render the Sidebar based on the route */}
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}

      <Routes>
        {/* Define all routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/PatientForm" element={<PatientForm />} />
        <Route path="/Invoice" element={<Invoice/>} />
        <Route path="/DoctorForm" element={<DoctorForm/>} />
        <Route path="/Technician/PatientDetails" element={<PatientDetails />} />
        <Route path="/SampleCollectorForm" element={<SampleCollectorForm />} />
        <Route path="/AddOrganisation" element={<AddOrganisation />} />
        <Route path="/Technician/TestDetails" element={<TestDetailsForm />} />
        <Route path="/Technician/Report" element={<Report />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
