import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import { ItemProvider } from './components/ItemContext';
import EditUser from './components/EditUser';
import { UserProvider } from './components/UserProvider';
function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edituser/:id" element={<EditUser />} />       </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </UserProvider>

    </>


  );
}

export default App;
