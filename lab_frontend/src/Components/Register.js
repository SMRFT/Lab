import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for custom styles
const RegisterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
`;

const RegisterContainer = styled.div`
  display: flex;
  width: 80%;
  height: 80%; /* Let the container adjust its height based on content */
  background-color: #fdf7f2;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  flex: 1;
  background-image: url(${require('../Components/Images/register-image.png')}); /* Adjust this path as per your directory structure */
  background-size: cover;
  background-position: center;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  background-color: #fdf7f2;
  padding: 50px;
  max-width: 600px;
  width: 100%;
`;

const FormTitle = styled.h1`
  font-family: sans-serif; /* Add custom font if needed */
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px; /* Space between form rows */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%; /* Allow space for two fields side by side */
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

const Select = styled.select`
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

const Register = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    axios.post('http://127.0.0.1:8000/registration/', formData)
      .then((response) => {
        setMessage('Registration successful!');
        console.log(response.data);
      })
      .catch((error) => {
        setMessage('Registration failed. Please try again.');
        console.error(error);
      });
  };

  return (
    <RegisterPage>
      <RegisterContainer>
        <LeftSection />
        <RightSection>
          <FormWrapper>
            <FormTitle>Register</FormTitle>
            <form onSubmit={handleSubmit}>
              <Row>
                <FormGroup>
                  <Label>ID</Label>
                  <Input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Row>

              <Row>
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
                  <Label>Role</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Technician">Technician</option>
                    <option value="Billing">Billing</option>
                  </Select>
                </FormGroup>
              </Row>

              <Row>
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
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Row>

              <SubmitButton type="submit">Register</SubmitButton>
            </form>

            {message && <p className="text-center mt-3">{message}</p>}
          </FormWrapper>
        </RightSection>
      </RegisterContainer>
    </RegisterPage>
  );
};

export default Register;
