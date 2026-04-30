import { Link } from "react-router-dom"
import "./Login.scss"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Login() {
  const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
  e.preventDefault()


  if (!email || !password) {
    setErrorMsg("Please fill all fields")
    return
  }


  setLoading(true)

    try {
      const response = await api.post("/api/auth/login", { email, password })

      const { token, user } = response.data
    
      console.log("FULL RESPONSE:", response.data);
      console.log("USER:", user);

      console.log("REMEMBER ME:", rememberMe);
      if (rememberMe) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(user))
      }
      setLoading(false);


      navigate("/dashboard")

    } catch (error) {
      setErrorMsg("Invalid email or password")
    }
    finally{
  setLoading(false)  
}
}

  return (
    <div className="login-page">
      <div className="login-background" />
      <div className="login-overlay" />

      <div className="login-content">
        <header className="brand-section">
          <p className="brand-badge">HIMFIT</p>
          <p className="brand-tagline">Unleash your potential</p>
        </header>

        <main className="login-card">
          <section className="card-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your fitness journey.</p>
          </section>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="input-label">
              <span>Email Address</span>
              <div className="input-group">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
  onChange={(e) => setPassword(e.target.value)}
/>
              </div>
            </label>

            <div className="form-meta">
              <label className="checkbox-label">
                <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
                              />
                              <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
{errorMsg && <p className="error">{errorMsg}</p>}
            <button
  type="submit"
  className="submit-button"
  disabled={loading}
>
  {loading ? "Loading..." : "Login"}
</button>
          </form>

          <div className="card-footer">
            <span>Don't have an account?</span>
            <Link to="/register" className="footer-link">Register</Link>
          </div>
        </main>
      </div>
    </div>
  )
}