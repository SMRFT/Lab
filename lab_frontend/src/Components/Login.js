import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for custom styles
const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
`;

const LoginContainer = styled.div`
  display: flex;
  width: 80%;
  height: 80%; /* Let the container adjust its height based on content */
  background-color: #fdf7f2;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 1;
  background-image: url(${require('../Components/Images/login-image.jpg')}); /* Adjust this path as per your directory structure */
  background-size: cover;
  background-position: center;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;


const FormWrapper = styled.div`
  background-color: #fdf7f2;
  padding: 50px;
  max-width: 400px;
  width: 100%;
`;

const FormTitle = styled.h1`
  font-family: sans-serif; /* Add custom font if needed */
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column; /* Stack the label on top of the input */
  margin-bottom: 15px; /* Space between form groups */
`;

const Label = styled.label`
  margin-bottom: 5px; /* Space between the label and the input */
  font-weight: bold;
  text-align: left;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: fit-content;
  padding: 10px 30px;
  background-color: black;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/login/', formData)
      .then((response) => {
        setMessage(response.data.message);
        console.log(response.data);

        // Redirect based on the user's role from the response
        const userRole = response.data.role;
        if (userRole === 'Admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'Doctor') {
          navigate('/doctor/dashboard');
        } else if (userRole === 'Technician') {
          navigate('/Technician/PatientDetails');
        } else if (userRole === 'Billing') {
          navigate('/billing/dashboard');
        }
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        console.error(error);
      });
  };

  return (
    <LoginPage>
      <LoginContainer>
        <LeftSection>
          <FormWrapper>
            <FormTitle>Welcome back !</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <SubmitButton type="submit">Sign In</SubmitButton>
            </form>
            {message && <p className="text-center mt-3">{message}</p>}
          </FormWrapper>
        </LeftSection>
        <RightSection />
      </LoginContainer>
    </LoginPage>
  );
};

export default Login;