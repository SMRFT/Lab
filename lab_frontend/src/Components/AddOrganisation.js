import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddOrganisation = ({ show, setShow }) => {
    const handleClose = () => setShow(false);
    const [referralType, setReferralType] = useState('Doctor');
    const [formData, setFormData] = useState({
        name: '',
        degree: '',
        compliment: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRadioChange = (e) => {
        setReferralType(e.target.value);
    };

    const handleAddOrganisation = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify({ 
            ...formData, 
            referral_type: referralType  // Correct key sent to backend
        }));
        
        try {
            const response = await fetch('http://127.0.0.1:8000/organisation/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    ...formData, 
                    referral_type: referralType,  // Using referral_type as expected by Django
                    compliment_percentage: formData.compliment // Matching Django model field
                })
            });
            if (response.ok) {
                alert('Organisation added successfully');
            } else {
                const errorData = await response.json();  // Capture the error response
                console.error('Error:', errorData);
                alert('Failed to add organisation: ' + JSON.stringify(errorData));  // Show detailed error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Organisation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
        <div className="form-group">
            <label>Referral Type:</label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input
                    type="radio"
                    id="doctor"
                    name="referralType"
                    value="Doctor"
                    checked={referralType === 'Doctor'}
                    onChange={handleRadioChange}
                />
                <label htmlFor="doctor">Doctor</label>

                <input
                    type="radio"
                    id="hospital"
                    name="referralType"
                    value="Hospital"
                    checked={referralType === 'Hospital'}
                    onChange={handleRadioChange}
                />
                <label htmlFor="hospital">Hospital</label>

                <input
                    type="radio"
                    id="lab"
                    name="referralType"
                    value="Lab"
                    checked={referralType === 'Lab'}
                    onChange={handleRadioChange}
                />
                <label htmlFor="lab">Lab</label>
            </div>
        </div>

        <div className="form-group">
                <label htmlFor="degree">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="degree">Degree:</label>
                <input
                    type="text"
                    className="form-control"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="compliment">Compliment %:</label>
                <input
                    type="number"
                    className="form-control"
                    id="compliment"
                    name="compliment"
                    value={formData.compliment}
                    onChange={handleChange}
                />
            </div>
            <Button style={{marginTop:"10px"}} type="submit" className="mb-3" onClick={handleAddOrganisation}>Save</Button>
        </form>
        </Modal.Body>
    </Modal>
    );
};

export default AddOrganisation;