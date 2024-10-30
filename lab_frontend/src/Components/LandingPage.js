import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImg from './Images/landing-page.jpg';

// Styled components for custom styling
const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1c1e22;
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  color: #e0e0e0;
  padding: 20px;
  position: relative;
`;

const HeaderContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: auto;
  padding: 10px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
`;

const NavLinkStyled = styled(NavLink)`
  color: #2F92B3;
  text-decoration: none;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: gold;
  }
`;

const LandingPage = () => {
  return (
    <LandingPageContainer>
      <HeaderContainer>
        <Nav>
          <NavLinkStyled to="/login">Receptionist</NavLinkStyled>
          <NavLinkStyled to="/login">Technician</NavLinkStyled>
          <NavLinkStyled to="/login">Doctor</NavLinkStyled>
          <NavLinkStyled to="/login">Admin</NavLinkStyled>
        </Nav>
      </HeaderContainer>
    </LandingPageContainer>
  );
};

export default LandingPage;
