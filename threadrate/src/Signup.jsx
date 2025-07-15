import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaApple } from 'react-icons/fa';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setMessage('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-accent px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ThreadRate
          </h1>
          <p className="text-muted-foreground">Join the fashion community</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card p-8 rounded-2xl shadow-fashion border border-border/50">
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
            Create Your Account
          </h2>
          
          {message && (
            <div className={`text-center text-sm mb-6 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                name="username" 
                placeholder="Choose a username" 
                value={form.username}
                onChange={handleChange} 
                required 
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:shadow-glow focus:border-primary focus:outline-none"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                value={form.email}
                onChange={handleChange} 
                required 
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:shadow-glow focus:border-primary focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                name="password" 
                type="password" 
                placeholder="Create a password" 
                value={form.password}
                onChange={handleChange} 
                required 
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:shadow-glow focus:border-primary focus:outline-none"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input 
                name="confirmPassword" 
                type="password" 
                placeholder="Confirm your password" 
                value={form.confirmPassword}
                onChange={handleChange} 
                required 
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:shadow-glow focus:border-primary focus:outline-none"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                required
                className="mt-1 accent-primary"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-sm text-muted-foreground bg-card">or continue with</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <FaGoogle className="text-red-500" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <FaApple className="text-foreground" />
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;