import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    let newErrors = { ...errors };
    if (id === 'email') {
      if (!isValidEmail(value)) newErrors.email = 'Invalid email address';
      else delete newErrors.email;
    }
    if (id === 'password') {
      if (!value) newErrors.password = 'Password is required';
      else delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('https://usermanagement-backend-vxs3.onrender.com/api/auth/login', formData);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId); 
          toast.success('Login successful!');
          navigate('https://usermanagement-backend-vxs3.onrender.com/dashboard');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
      }
    } else {
      toast.error('Please fix validation errors');
    }
  };


  return (
   
    <div className="maincontainer d-flex justify-content-center align-items-center min-vh-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container2 bg-white shadow-lg w-100" style={{ maxWidth: '900px' }}>
        <div className="row g-0 h-100" style={{ minHeight: '600px' }}>

          <div className="col-md-6 d-flex align-items-center">
            <img
              src="https://images.pexels.com/photos/9222422/pexels-photo-9222422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="login"
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <h4 className="text-center text-primary mb-4">Sign In User Management Portal</h4>
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

                <div className="text-center mt-3">
                  <p className="small">
                    Don't have an account?{' '}
                    <Link to="https://usermanagement-backend-vxs3.onrender.com/register" className="text-decoration-underline text-primary">
                      Signup
                    </Link>
                  </p>
                </div>

                <Button color="primary" block className="rounded-pill mt-3">
                  Sign In
                </Button>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default Login;
