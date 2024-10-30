import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';

// Styled components for the Signout button
const SignoutContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 100;
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 40px;
  color: #333;
  cursor: pointer;
`;

const Greeting = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const SignoutButton = styled.button`
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
`;

const Signout = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSignout, setShowSignout] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  // Fetch user data from localStorage (or wherever it's stored)
  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    setUser({ name, email });
  }, []);

  const handleSignout = () => {
    // Clear user data from localStorage or perform necessary cleanup
    localStorage.clear();

    // Navigate to the login page after signout
    navigate('/');
  };

  return (
    <SignoutContainer>
      <UserIcon
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        onClick={() => setShowSignout(true)}
      />

      {/* Show the user info on hover */}
      <UserInfo show={showInfo}>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </UserInfo>

      {/* Show the Signout button and greeting when clicked */}
      {showSignout && (
        <div>
          <Greeting>Hi, {user.name}</Greeting>
          <SignoutButton onClick={handleSignout}>Sign Out</SignoutButton>
        </div>
      )}
    </SignoutContainer>
  );
};

export default Signout;
