// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <h1 className="logo">Web Vitals</h1>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Sign In
        </button>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Automated Web Performance <span>Measurement</span></h1>
          <p>
            A comprehensive system for monitoring, visualizing, and analyzing website performance 
            metrics using Google Lighthouse.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/login')} className="btn-primary large">
              Get Started
            </button>
          </div>
        </div>
        <div className="hero-image">
          {/* We will use CSS to make a cool graphic here */}
          <div className="mock-chart">
             <div className="bar" style={{height: '60%'}}></div>
             <div className="bar" style={{height: '80%'}}></div>
             <div className="bar" style={{height: '40%'}}></div>
             <div className="bar" style={{height: '90%'}}></div>
          </div>
        </div>
      </header>

      {/* Team Section - IMPORTANT for Referees */}
      <section className="team-section">
        <h2>Meet The Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <h3>Saleh Sulieman</h3>
            <p>DevOps & Automation</p>
          </div>
          <div className="team-card">
            <h3>Mahmoud Jalloh</h3>
            <p>Backend & Data</p>
          </div>
          <div className="team-card">
            <h3>Salma Rahmani</h3>
            <p>Frontend UI (You)</p>
          </div>
          <div className="team-card">
            <h3>Nodira Zokirova</h3>
            <p>Data Visualization</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;