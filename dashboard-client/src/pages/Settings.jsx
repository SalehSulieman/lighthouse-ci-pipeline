import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-card">
        <h3>Profile Information</h3>
        <div className="setting-item">
          <span>Username:</span> <strong>Admin User</strong>
        </div>
        <div className="setting-item">
          <span>Email:</span> <strong>admin@webvitals.com</strong>
        </div>
        <div className="setting-item">
          <span>Role:</span> <strong>Administrator</strong>
        </div>
      </div>
    </div>
  );
};

export default Settings;