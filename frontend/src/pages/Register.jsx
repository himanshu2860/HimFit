import { Link } from "react-router-dom";
import './Register.scss';
import api from "../api/axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
    const [username, setUsername] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [calorieGoal, setCalorieGoal] = useState("")
const [proteinGoal, setProteinGoal] = useState("")
  const [fatGoal, setFatGoal] = useState("")
  const [step, setStep] = useState(1)

    const navigate = useNavigate()
    
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !email || !password || !calorieGoal || !proteinGoal || !fatGoal) {
    setErrorMsg("Please fill all fields");
    return;
  }

  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];

  const parts = email.split("@");

  if (parts.length !== 2) {
    setErrorMsg("Invalid email format ");
    return;
  }

  const domain = parts[1].toLowerCase();

  if (!allowedDomains.includes(domain)) {
    setErrorMsg("Please use a valid email ");
    return;
  }

  setLoading(true);

  try {
  const res = await api.post("/api/auth/register", {
    username,
    email,
    password,
    calorieGoal,
    proteinGoal,
    fatGoal,
  });

  const data = res.data;

  alert("Registered successfully!");
  navigate("/login");

} catch (error) {
  setErrorMsg(error.response?.data?.message || "Registration failed");
} finally {
  setLoading(false);
}

};
    
  return (
    <div className="register-page">
      <div className="register-background" />
      <div className="register-overlay" />

      <div className="register-content">
        <header className="brand-section">
          <p className="brand-badge">HIMFIT</p>
          <p className="brand-tagline">Unleash your potential</p>
        </header>

        <main className="register-card">
          <section className="card-header">
            <h1>Create Account</h1>
            <p>Join the elite performance laboratory today.</p>
          </section>

          <form className="register-form" onSubmit={handleSubmit} noValidate>


 
  {step === 1 && (
    <>
      <label className="input-label">
        <span>Full Name</span>
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            placeholder="Himanshu Sharma"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setErrorMsg("")
            }}
          />
        </div>
      </label>

      <label className="input-label">
        <span>Email Address</span>
        <div className="input-group">
          <span className="input-icon">✉</span>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrorMsg("")
            }}
          />
        </div>
      </label>

      <label className="input-label">
        <span>Password</span>
        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMsg("")
            }}
          />
        </div>
      </label>

     
      <button
        type="button"
        className="submit-button"
        onClick={() => {
  if (!username || !email || !password) {
    setErrorMsg("Fill all fields first")
    return
  }
  setStep(2)
}}
      >
        Next →
      </button>
    </>
  )}


  {step === 2 && (
    <>
      <label className="input-label">
        <span>Calorie Goal (gms)</span>
        <div className="input-group">
          <input
            type="number"
            placeholder="2000"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
          />
        </div>
      </label>

      <label className="input-label">
        <span>Protein Goal (gms)</span>
        <div className="input-group">
          <input
            type="number"
            placeholder="100"
            value={proteinGoal}
            onChange={(e) => setProteinGoal(e.target.value)}
          />
        </div>
      </label>

      <label className="input-label">
        <span>Fat Goal (gms)</span>
        <div className="input-group">
          <input
            type="number"
            placeholder="70"
            value={fatGoal}
            onChange={(e) => setFatGoal(e.target.value)}
          />
        </div>
      </label>

      <div className="form-meta">
        <label className="checkbox-label">
          <input type="checkbox" />
         <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</span>
        </label>
      </div>

     <div className="button-row">
  <button
    type="button"
    className="back-button"
    onClick={() => setStep(1)}
  >
    ← Back
  </button>

  <button
    type="submit"
    className="submit-button"
    disabled={loading}
  >
    {loading ? "Loading..." : "Register"}
  </button>
</div>
    </>
  )}

  {errorMsg && <p className="error">{errorMsg}</p>}

</form>

          <div className="card-footer">
            <span>Already have an account?</span>
            <Link to="/" className="footer-link">Login</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
