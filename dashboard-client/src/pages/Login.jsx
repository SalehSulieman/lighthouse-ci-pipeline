// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import hook
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useUser(); // Get function to update global state

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    // 1. Get existing users from storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 2. Try to find user
    let foundUser = users.find(u => u.email === email);

    if (foundUser) {
      // EXISTING USER: Check password
      if (foundUser.password === password) {
        loginSuccess(foundUser);
      } else {
        alert('Incorrect password for existing user.');
      }
    } else {
      // NEW USER: Create account automatically
      const name = email.split('@')[0]; // Create name from email
      const newUser = { 
        name: name, 
        email: email, 
        password: password, 
        avatar: null 
      };

      // Save to 'users' list in storage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log them in
      loginSuccess(newUser);
    }
  };

  const loginSuccess = (user) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // UPDATE CONTEXT (This forces Sidebar/Settings to refresh immediately)
    updateUser(user);
    
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in or create a new account</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter any email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary full-width">Sign In / Register</button>
        </form>
      </div>
    </div>
  );
};

export default Login;