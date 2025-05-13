import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Container, Row, Col, Input, Button,
  Table, Badge,
  Label
} from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useItemContext } from './ItemContext';
import DeleteModal from './DeleteModal';
import { UserContext } from './UserProvider';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    department: '',
    userRole: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dob: '',
  });
  const { users = [] } = useItemContext() || {};
  const { userss } = useContext(UserContext);

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 1;
  const paginatedUser = filteredUsers.slice(currentPage, currentPage + usersPerPage);

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(u => u.status === 'Active').length;
  const inactiveUsers = filteredUsers.filter(u => u.status === 'Inactive').length;

  const departments = ['Computer Science', 'Electronics', 'Mathematics', 'Commerce'];
  const roles = ['Admin', 'Student', 'Teaching Staff', 'Non-Teaching Staff'];
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  const handleEditClick = (user) => {
    if (user && user._id) {
      navigate(`/edituser/${user._id}`);
    } else {
      console.error("User ID is undefined");
    }
  };



  useEffect(() => {
    axios.get('https://usermanagement-backend-vxs3.onrender.com/api/items/users')
      .then(res => {
        setUserList(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = userList;

    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.userRole === filters.role);
    }

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [filters, searchTerm, userList]);

  const validateField = (name, value) => {
    let error = '';
    const nameRegex = /^[A-Za-z ]+$/;

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) error = 'This field is required';
        else if (!nameRegex.test(value)) error = 'Only letters and spaces allowed';
        break;
      case 'username':
      case 'department':
      case 'userRole':
      case 'dob':
        if (!value) error = 'This field is required';
        break;
      case 'password':
        if (!value) error = 'This field is required';
        else if (value.length < 8) error = 'Must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'This field is required';
        else if (value !== form.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (let key in form) validateField(key, form[key]);
    if (!image) newErrors.image = 'Profile image is required';
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const resetForm = () => {
    setForm({
      department: '',
      userRole: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      dob: '',
    });
    setErrors({});
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('profileImage', image);
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      await axios.post('https://usermanagement-backend-vxs3.onrender.com/api/items/adduser', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('User added successfully!');
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < filteredUsers.length) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Container fluid className="p-3">
      <div className="border rounded mb-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="bg-primary text-white p-3">
          <h4 className="mb-0">Create Users</h4>
        </div>

        <Row className="p-3 border-bottom">
          <Col md={6}>
            {[
              { label: 'Department', id: 'department', options: departments },
              { label: 'User Role', id: 'userRole', options: roles },
              { label: 'First Name', id: 'firstName', type: 'text' },
              { label: 'Last Name', id: 'lastName', type: 'text' },
            ].map(({ label, id, type = 'select', options }) => (
              <div className="mb-3" key={id}>
                <div className="d-flex">
                  <div className="me-3" style={{ width: '140px', color: '#555', fontWeight: 600 }}>
                    {label}<span className="text-danger">*</span>:
                  </div>
                  {type === 'select' ? (
                    <Input id={id} type="select" value={form[id]} onChange={handleChange} style={{ flex: 1 }}>
                      <option value="">SELECT {label.toUpperCase()}</option>
                      {options.map(opt => <option key={opt}>{opt}</option>)}
                    </Input>
                  ) : (
                    <Input id={id} type={type} value={form[id]} onChange={handleChange} style={{ flex: 1 }} />
                  )}
                </div>
                {errors[id] && <div className="text-danger ms-3">{errors[id]}</div>}
              </div>
            ))}
          </Col>

          <Col md={6}>
            {[
              { label: 'Username', id: 'username', type: 'text' },
              { label: 'Password', id: 'password', type: 'password' },
              { label: 'Confirm Password', id: 'confirmPassword', type: 'password' },
              { label: 'Date of Birth', id: 'dob', type: 'date' },
            ].map(({ label, id, type }) => (
              <div className="mb-3" key={id}>
                <div className="d-flex">
                  <div className="me-3" style={{ width: '140px', color: '#555', fontWeight: 600 }}>
                    {label}<span className="text-danger">*</span>:
                  </div>
                  <Input id={id} type={type} value={form[id]} onChange={handleChange} style={{ flex: 1 }} />
                </div>
                {errors[id] && <div className="text-danger ms-3">{errors[id]}</div>}
              </div>
            ))}

            <div className="mb-3">
              <div className="d-flex">
                <div className="me-3" style={{ width: '140px', color: '#555', fontWeight: 600 }}>
                  Profile Image<span className="text-danger">*</span>:
                </div>
                <Input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ flex: 1 }} />
              </div>
              {errors.image && <div className="text-danger ms-3">{errors.image}</div>}
              {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100px', marginLeft: '140px' }} />}
            </div>
          </Col>
        </Row>

        <div className="p-3">
          <Button color="primary" style={{ width: '120px', height: '40px' }} onClick={handleSubmit}>Save</Button>
          <Button color="primary" style={{ width: '120px', height: '40px' }} className="ms-2" onClick={resetForm}>Cancel</Button>
        </div>
      </div>
      <div className="border rounded">
        <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">User List</h4>
          <div>
            <span className="me-3">Total Users: <strong>{totalUsers}</strong></span>
            <span className="me-3" style={{ color: '#006400' }}>Active: <strong>{activeUsers}</strong></span>
            <span className="me-3" style={{ color: '#8B0000' }}>Inactive: <strong>{inactiveUsers}</strong></span>
            <Button color="info" size="sm">Export Excel</Button>
          </div>
        </div>

        <div className="p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Label className="me-2 mb-0">Show</Label>
            <Input type="select" className="me-2" style={{ width: '80px' }} value={usersPerPage} onChange={e => setUsersPerPage(Number(e.target.value))}>
              <option value="1">1</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Input>
            <Label className="mb-0">entries</Label>
          </div>

          <div className="d-flex align-items-center">
            <Input
              type="select"
              className="me-2"
              style={{ width: '150px' }}
              value={filters.department}
              onChange={e => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">SELECT DEPARTMENT</option>
              {departments.map(dep => <option key={dep}>{dep}</option>)}
            </Input>

            <Input
              type="select"
              className="me-2"
              style={{ width: '150px' }}
              value={filters.role}
              onChange={e => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">SELECT ROLE</option>
              {roles.map(role => <option key={role}>{role}</option>)}
            </Input>

            <Input
              type="select"
              className="me-2"
              style={{ width: '150px' }}
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">SELECT STATUS</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Input>

            <Input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

     
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>User Name</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUser.map((user, index) => (
              <tr key={user._id}>
                <td>{currentPage * usersPerPage + index + 1}</td>
                <td>{user.username}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.department}</td>
                <td>{user.userRole}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td><Badge color={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge></td>
                <td>
                  <Button color="primary" size="sm" className="me-2" onClick={() => handleEditClick(user)}>Edit</Button>
                  <Button color="danger" size="sm" onClick={() => handleDeleteClick(user)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedUser && (
          <DeleteModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            user={selectedUser}
          />
        )}
        <div className="d-flex justify-content-between align-items-center px-3 pb-3">
          <div>
            Showing {currentPage * usersPerPage + 1} to {Math.min((currentPage + 1) * usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
          </div>
          <div className="d-flex align-items-center">
            <Button color="secondary" size="sm" onClick={() => handlePageChange(0)} disabled={currentPage === 0}>First</Button>{' '}
            <Button color="secondary" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</Button>{' '}
            <Button color="light" disabled>{currentPage + 1}</Button>{' '}
            <Button color="secondary" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= Math.ceil(filteredUsers.length / usersPerPage)}>Next</Button>{' '}
            <Button color="secondary" size="sm" onClick={() => handlePageChange(Math.ceil(filteredUsers.length / usersPerPage) - 1)} disabled={currentPage + 1 >= Math.ceil(filteredUsers.length / usersPerPage)}>Last</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
