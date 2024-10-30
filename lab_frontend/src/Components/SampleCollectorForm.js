import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const SampleCollectorForm = ({ show, setShow }) => {
    const [ showSampleCollectorForm, setShowSampleCollectorForm ] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSampleCollectorSave = (e) => {
        e.preventDefault(); // Prevent the form submission
        // API call to save the sample collector
        axios.post('http://127.0.0.1:8000/sample-collector/', formData)
          .then(response => {
            console.log("Sample collector saved:", response.data);
            alert('Sample Collector saved successfully!');
            setShowSampleCollectorForm(false); // Close the form if needed
          })
          .catch(error => {
            console.error('Error saving sample collector:', error.response.data);
            alert('Error saving sample collector. Please try again.');
          });
    };

      

    const handleClose = () => {
        setShow(false);  // Close modal on click of close button
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Sample Collector</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                label="Male"
                                name="gender"
                                value="male"
                                onChange={handleChange}
                                inline
                                required
                            />
                            <Form.Check
                                type="radio"
                                label="Female"
                                name="gender"
                                value="female"
                                onChange={handleChange}
                                inline
                            />
                            <Form.Check
                                type="radio"
                                label="Other"
                                name="gender"
                                value="other"
                                onChange={handleChange}
                                inline
                            />
                        </div>
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button style={{marginTop:"10px"}} type="submit" className="mb-3" onClick={handleSampleCollectorSave}>Save</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SampleCollectorForm;
