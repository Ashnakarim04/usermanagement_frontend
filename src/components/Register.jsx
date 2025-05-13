import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...formData, [id]: value };
    setFormData(updatedForm);
    validateField(id, value, updatedForm);
  };

  const validateField = (field, value, form = formData) => {
    let fieldErrors = { ...errors };

    if (field === 'email') {
      if (!isValidEmail(value)) fieldErrors.email = 'Invalid email address';
      else delete fieldErrors.email;
    }

    if (field === 'password') {
      if (!value || value.length < 8) fieldErrors.password = 'Password must be at least 8 characters';
      else delete fieldErrors.password;
    }

    if (field === 'confirmPassword') {
      if (value !== form.password) fieldErrors.confirmPassword = 'Passwords do not match';
      else delete fieldErrors.confirmPassword;
    }

    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill out all fields');
      return;
    }

    if (Object.keys(errors).length === 0) {
      try {
        // const response = await axios.post('http://localhost:5000/api/auth/register', formData);
                const response = await axios.post('https://usermanagement-backend-vxs3.onrender.com/api/auth/register', formData);

        if (response.status === 200) {
          toast.success('Registered successfully!');
          navigate('/');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } else {
      toast.error('Please correct the validation errors');
    }
  };

  return (

    <div className="maincontainer d-flex align-items-center justify-content-center min-vh-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container2 bg-white shadow-lg w-100" style={{ maxWidth: '900px' }}>
        <div className="row g-0 h-100" style={{ minHeight: '600px' }}>

          <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <h4 className="text-center text-primary mb-4">Sign Up User Management Portal</h4>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'is-invalid' : ''}
                  />
                  {errors.email && <div className="text-danger small">{errors.email}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'is-invalid' : ''}
                  />
                  {errors.password && <div className="text-danger small">{errors.password}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'is-invalid' : ''}
                  />
                  {errors.confirmPassword && <div className="text-danger small">{errors.confirmPassword}</div>}
                </FormGroup>

                <div className="text-center mt-3">
                  <p className="small">
                    Already have an account?{' '}
                    <Link to="https://usermanagement-backend-vxs3.onrender.com/" className="text-decoration-underline text-primary">
                      Login
                    </Link>
                  </p>
                </div>

                <Button color="primary" block className="rounded-pill mt-3">
                  Sign Up
                </Button>
              </Form>
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <img
              src="https://images.pexels.com/photos/5904074/pexels-photo-5904074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="signup"
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

        </div>
      </div>
    </div>

  );
};

export default Register;
