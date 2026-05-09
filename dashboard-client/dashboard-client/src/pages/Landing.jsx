// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Check, XCircle, Activity, Cpu, BarChart3, Mail, GitBranch } from 'lucide-react';
import Toast from '../components/Toast';
import './Landing.css';

// --- IMPORT TEAM PHOTOS ---

import salehImg from '../assets/saleh.jpg'; 
import mahmoudImg from '../assets/mahmoud.jpg';
import salmaImg from '../assets/salma.jpg';
import nodiraImg from '../assets/nodira.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [pwdFocus, setPwdFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pwdValid, setPwdValid] = useState({
    length: false, uppercase: false, number: false, special: false,
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPwdValid({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
    });
  };

  const openLogin = () => { setIsRegister(false); setShowAuth(true); };
  const openRegister = () => { setIsRegister(true); setShowAuth(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      const allValid = Object.values(pwdValid).every(v => v);
      if (!allValid) { showToast("Password does not meet requirements", "error"); return; }
      if (!name || !email) { showToast("Please fill all fields", "error"); return; }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) { showToast("User already exists!", "error"); return; }
      
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      showToast("Account created successfully!", "success");
      setIsRegister(false);
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        showToast("Invalid email or password", "error");
      }
    }
  };

  return (
    <div className="landing-page">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false })} />}

      <div className="landing-main">
        <nav className="landing-nav">
          <div className="logo-container">
            <Zap size={30} className="logo-icon" />
            <span className="logo-text">Web Vitals</span> 
          </div>
          <button onClick={openLogin} className="btn-primary btn-nav">
            Sign In
          </button>
        </nav>

        <header className="hero">
          <div className="hero-content">
            <h1>Automated Web Performance <span>Measurement</span></h1>
            <p className="hero-description">
              A comprehensive system for monitoring, analyzing, and visualizing website performance metrics using Google Lighthouse.
            </p>
            <div className="hero-buttons">
              <button onClick={openRegister} className="btn-primary btn-large btn-wide">
                Get Started
              </button>
            </div>
          </div>

          <div className="hero-image">
            {showAuth ? (
              <div className="auth-overlay">
                <div className="auth-card">
                  <button className="close-btn" onClick={() => setShowAuth(false)}><X size={20} /></button>
                  <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
                  <p>{isRegister ? "Start monitoring" : "Sign in to continue"}</p>
                  
                  <form onSubmit={handleSubmit}>
                    {isRegister && ( <div className="input-group"><label>Full Name</label><input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /></div> )}
                    <div className="input-group"><label>Email</label><input type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="input-group">
                      <label>Password</label>
                      <input type="password" placeholder="••••••••" value={password} onChange={handlePasswordChange} onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} />
                      {isRegister && pwdFocus && ( <div className="pwd-rules">
                          <div className={pwdValid.length ? 'rule valid' : 'rule invalid'}>{pwdValid.length ? <Check size={14} /> : <XCircle size={14} />} Min 8 chars</div>
                          <div className={pwdValid.uppercase ? 'rule valid' : 'rule invalid'}>{pwdValid.uppercase ? <Check size={14} /> : <XCircle size={14} />} Uppercase</div>
                          <div className={pwdValid.number ? 'rule valid' : 'rule invalid'}>{pwdValid.number ? <Check size={14} /> : <XCircle size={14} />} Number</div>
                          <div className={pwdValid.special ? 'rule valid' : 'rule invalid'}>{pwdValid.special ? <Check size={14} /> : <XCircle size={14} />} Special (!@#$)</div>
                      </div> )}
                    </div>
                    <button type="submit" className="btn-primary full-width">{isRegister ? "Register" : "Sign In"}</button>
                  </form>
                  <p className="switch-text">{isRegister ? "Already have an account?" : "Don't have an account?"}<span onClick={() => setIsRegister(!isRegister)}>{isRegister ? " Sign In" : " Create Account"}</span></p>
                </div>
              </div>
            ) : (
              <div className="mock-chart">
                 <div className="bar" style={{height: '60%'}}></div>
                 <div className="bar" style={{height: '80%'}}></div>
                 <div className="bar" style={{height: '40%'}}></div>
                 <div className="bar" style={{height: '90%'}}></div>
              </div>
            )}
          </div>
        </header>

        <div className="tech-strip">
            <div className="tech-item"><Cpu size={18} /> Node.js Backend</div>
            <div className="tech-item"><Activity size={18} /> React Frontend</div>
            <div className="tech-item"><BarChart3 size={18} /> Lighthouse CI</div>
            <div className="tech-item"><Zap size={18} /> Real-time Charts</div>
        </div>

                                   <section className="team-section">
          <h2>Meet The Team</h2>
          <div className="team-grid">
            
            {/* SALEH */}
            <div className="team-card">
              <div className="avatar-img-container">
                 <img src={salehImg} alt="Saleh" className="avatar-img" />
              </div>
              <h3>Saleh Sulieman</h3>
              <p className="team-role">DevOps & Automation</p>
              <p className="team-bio">Specializes in automating deployment pipelines and ensuring smooth CI/CD workflows.</p>
              
              <div className="team-socials">
                <a href="Skhaledsulieman@gmail.com" className="social-icon"><Mail size={20} /></a>
                <a href="https://github.com/SalehSulieman" target="_blank" rel="noreferrer" className="social-icon"><GitBranch size={20} /></a>
              </div>
            </div>

            {/* MAHMOUD */}
            <div className="team-card">
              <div className="avatar-img-container">
                 <img src={mahmoudImg} alt="Mahmoud" className="avatar-img" />
              </div>
              <h3>Mahmoud Jalloh</h3>
              <p className="team-role">Backend & Data</p>
              <p className="team-bio">Focuses on server-side logic, API development, and efficient database management.</p>
              
              <div className="team-socials">
                <a href="mailto:mahmoud@webvitals.com" className="social-icon"><Mail size={20} /></a>
                <a href="https://github.com/mahmoud-username" target="_blank" rel="noreferrer" className="social-icon"><GitBranch size={20} /></a>
              </div>
            </div>

            {/* SALMA */}
            <div className="team-card">
              <div className="avatar-img-container">
                 <img src={salmaImg} alt="Salma" className="avatar-img" />
              </div>
              <h3>Salma Rahmani</h3>
              <p className="team-role">Frontend UI</p>
              <p className="team-bio">Crafts intuitive user interfaces and translates design concepts into functional web applications.</p>
              
              <div className="team-socials">
                <a href="mailto:salma056@gmail.com" className="social-icon"><Mail size={20} /></a>
                <a href="https://github.com/salmarahmani" target="_blank" rel="noreferrer" className="social-icon"><GitBranch size={20} /></a>
              </div>
            </div>

            {/* NODIRA */}
            <div className="team-card">
              <div className="avatar-img-container">
                 <img src={nodiraImg} alt="Nodira" className="avatar-img" />
              </div>
              <h3>Nodira Zokirova</h3>
              <p className="team-role">Data Visualization</p>
              <p className="team-bio">Transforms complex performance data into clear, actionable visual insights and charts.</p>
              
              <div className="team-socials">
                <a href="mailto:nodira@webvitals.com" className="social-icon"><Mail size={20} /></a>
                <a href="https://github.com/nodira-username" target="_blank" rel="noreferrer" className="social-icon"><GitBranch size={20} /></a>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;