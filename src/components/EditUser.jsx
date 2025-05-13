import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const roles = ['Admin', 'Student', 'Teaching Staff', 'Non-Teaching Staff'];
  const departments = ['Computer Science', 'Electronics', 'Mathematics', 'Commerce'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    if (id) {
      fetch(`/api/items/users/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Fetch failed: ${res.status} - ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          setUser(data);
          if (data.profileImage) {
            setImagePreview(`/uploads/${data.profileImage}`);
          }
        })
        .catch((err) => {
          setError(`Failed to load user data: ${err.message}`);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['firstName', 'lastName', 'username', 'department', 'userRole', 'status', 'dob'];
    for (const field of requiredFields) {
      if (!user[field]) {
        toast.error(`${field} is required!`);
        return;
      }
    }

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append('profileImage', imageFile); 

    }

    try {
      const response = await fetch(`/api/items/users/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success('User updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-4">
      {user ? (
        <>
          <h2>Edit User: {user.firstName} {user.lastName}</h2>
          <form onSubmit={handleSubmit} className="mt-3" encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={user.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Department</label>
                  <select
                    className="form-control"
                    name="department"
                    value={user.department}
                    onChange={handleChange}
                  >
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Role</label>
                  <select
                    className="form-control"
                    name="userRole"
                    value={user.userRole}
                    onChange={handleChange}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={user.status}
                    onChange={handleChange}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="mb-3">
                  <label>Profile Image</label><br />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" width="150" height="150" />
                  ) : (
                    <p>No image uploaded</p>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Update User</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditUser;
