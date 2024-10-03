import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard'; 
import BrowseCategory from './components/BrowseCategory';
import CreateProduct from './components/CreateProduct'; 
import UpdateProduct from './components/UpdateProduct'; 
import DeleteProduct from './components/DeleteProduct'; 
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    // Load the user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load user from localStorage on page load (to prevent logout on refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));  // Persist user state from localStorage
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage on logout
    setUser(null);  // Clear the user state
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* User Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            user ? (user.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Dashboard user={user} onLogout={handleLogout} />) : <Navigate to="/login" />
          } 
        />
        <Route path="/register" element={<Register />} /> 
        {/* Cart Route */}
        <Route path="/cart" element={user ? <Cart user={user} /> : <Navigate to="/login" />} />

        {/* Browse by Category Route */}
        <Route path="/browse-category" element={user ? <BrowseCategory /> : <Navigate to="/login" />} />

        {/* Admin Dashboard Route */}
        <Route 
          path="/admin-dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* Admin functionalities (Create, Update, Delete Products) */}
        <Route path="/create-product" element={user?.role === 'admin' ? <CreateProduct /> : <Navigate to="/login" />} />
        <Route path="/update-product" element={user?.role === 'admin' ? <UpdateProduct /> : <Navigate to="/login" />} />
        <Route path="/delete-product" element={user?.role === 'admin' ? <DeleteProduct /> : <Navigate to="/login" />} />

        {/* Catch all - Redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;