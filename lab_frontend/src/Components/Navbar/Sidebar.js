import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// Styled components for the sidebar
const SidebarContainer = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '250px' : '0')};
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
  z-index: 1000;

  @media (min-width: 768px) {
    width: 250px; /* Sidebar fully open on larger screens */
  }
`;

const SidebarContent = styled.div`
  padding: 20px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  @media (min-width: 768px) {
    display: block;
  }
`;

const SidebarNavLink = styled(NavLink)`
  color: white;
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }

  &.active {
    background-color: #555;
  }
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 15px;
  left: ${({ isOpen }) => (isOpen ? '260px' : '20px')};
  font-size: 25px;
  color: white;
  cursor: pointer;
  z-index: 2000;

  @media (min-width: 768px) {
    display: none; /* Hide toggle button on larger screens */
  }
`;

const MainContent = styled.div`
  margin-left: ${({ isOpen }) => (isOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease-in-out;
  padding: 20px;

  @media (min-width: 768px) {
    margin-left: 250px;
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarContent isOpen={isOpen}>
          <SidebarNavLink to="/admin">Admin</SidebarNavLink>
          <SidebarNavLink to="/doctor">Doctor</SidebarNavLink>
          <SidebarNavLink to="/Technician/PatientDetails">Technician</SidebarNavLink>
          <SidebarNavLink to="/billing">Billing</SidebarNavLink>
        </SidebarContent>
      </SidebarContainer>

      <ToggleButton isOpen={isOpen} onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>

    </>
  );
};

export default Sidebar;
