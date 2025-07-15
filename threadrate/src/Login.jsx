import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', form);
      localStorage.setItem('token', res.data.token); // You can use this later for protected routes
      setMessage('Logged in!');
      setTimeout(() => navigate('/dashboard'), 1000); // Replace with your actual dashboard route
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        {message && <div className="text-center text-sm text-red-500 mb-4">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" className="w-full py-2 bg-purple-500 text-white rounded-md">Log In</button>
        </form>
        <p className="mt-4 text-sm text-center">Don’t have an account? <a href="/signup" className="text-purple-600">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
