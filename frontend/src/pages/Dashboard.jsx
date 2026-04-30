import './Dashboard.scss'
import { useEffect, useState } from "react"
import api from "../api/axios"
import { Link, useNavigate } from "react-router-dom"
import successSound from "../assets/sounds/videoplayback.mp3";
import { useRef } from "react";
import confetti from "canvas-confetti"
import gsap from "gsap";
export default function Dashboard() {
const cardsRef = useRef([]);
const storedUser =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user"));

const userName = storedUser?.username || "User";
const firstLetter = userName.charAt(0).toUpperCase();
const calorieGoal = storedUser?.goalCalories ?? 2000;
const proteinGoal = storedUser?.goalProtein ?? 100;
  const fatGoal = storedUser?.goalFat ?? 70;


    const [summary, setSummary] = useState(null)
    const [foodText, setFoodText] = useState("")
    const [foods, setFoods] = useState([])
    const [successMsg, setSuccessMsg] = useState("")
    const [showGoalPopup, setShowGoalPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  
const [newCalories, setNewCalories] = useState(calorieGoal);
const [newProtein, setNewProtein] = useState(proteinGoal);
  const [newFat, setNewFat] = useState(fatGoal);

   const navigate = useNavigate()
const audioRef = useRef(null);
const hasPlayed = useRef(false);
  
     const today = new Date()

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
    
    
const totalCalories = summary?.totalCalories || 0;

const isGoalReached =
  totalCalories >= calorieGoal &&
  totalCalories <= calorieGoal + 20; 

const rawProgress = (totalCalories / calorieGoal) * 100;

const progress = Math.min(rawProgress, 100);

const radius = 90
const circumference = 2 * Math.PI * radius

    const offset = circumference - (progress / 100) * circumference
    
  const isOver = (summary?.totalCalories || 0) > calorieGoal
  
  const isTooMuch = totalCalories > calorieGoal + 20;

const handleLogout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  navigate("/login");
};
    
  const handleAnalyze = async () => {
  if (isLoading) return;  

  if (!foodText) {
    setError(" Please enter food first");
    return;
  }

  setIsLoading(true);
  setError(""); 

  try {
    await api.post("/api/food/analyze", {
      food: foodText
    });

  
    const updated = await api.get("/api/food/summary");
    setSummary(updated.data);


    setSuccessMsg("Food analyzed & saved ");

    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);

    
    const foodRes = await api.get("/api/food");
    setFoods(foodRes.data.data);

    setFoodText("");

  } catch (err) {
    console.log(err);


    setError(" AI is busy, try again in a moment");
  } finally {
    setIsLoading(false);
  }
  };
  
  const handleUpdate = async () => {
    try {
       const token =
      localStorage.getItem("token") ||
        sessionStorage.getItem("token");
      
    const res = await api.put(
      "/api/auth/update-goals",
      {
        goalCalories: newCalories,
        goalProtein: newProtein,
        goalFat: newFat,
      },
      {
        headers: {
           Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.setItem("user", JSON.stringify(res.data.user));

    setShowEdit(false);

    window.location.reload(); 

  } catch (err) {
    console.log(err);
  }
};


  useEffect(() => {
  const fetchData = async () => {
    try {
      const summaryRes = await api.get("/api/food/summary")
      setSummary(summaryRes.data)

      const foodRes = await api.get("/api/food")
      setFoods(foodRes.data.data)   
    } catch (err) {
      console.log("Error fetching data", err)
    }
  }

  fetchData()
  }, [])

 useEffect(() => {
  if (!isGoalReached) return;

  if (!hasPlayed.current) {
    hasPlayed.current = true;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});

    setShowGoalPopup(true);
  }
}, [isGoalReached]);
    
useEffect(() => {
  if (!showGoalPopup) return;

  const timer = setTimeout(() => {
    setShowGoalPopup(false);
  }, 3000);

  return () => clearTimeout(timer);
}, [showGoalPopup]);
  
  useEffect(() => {
  gsap.fromTo(
    cardsRef.current,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    }
  );
}, []);
  return (
    <div className="dashboard-container">
     

    
      <main className="dashboard-main">
      
        <header className="dashboard-header">
          <div className="header-left">
                      <h2>Welcome, {userName}</h2>
            <p>{formattedDate.toUpperCase()}</p>
          </div>
          <div className="header-right"   onClick={() => navigate("/profile")}>
            
            {firstLetter}
          </div>
        </header>

    
        <div className="dashboard-grid">
       
          <div className="left-column">
           
           <div
  className="calorie-card"
  ref={(el) => (cardsRef.current[0] = el)}
>
              <div className="calorie-circle">
                              <svg viewBox="0 0 200 200" className="circle-chart">
                                  <defs>
  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#5cff6d" />
    <stop offset="100%" stopColor="#29d84a" />
  </linearGradient>
</defs>
                  <circle cx="100" cy="100" r="90" className="circle-bg" />
<circle
  cx="100"
  cy="100"
  r="90"
  className={`circle-progress 
    ${isGoalReached ? "goal" : ""} 
    ${isTooMuch ? "danger" : ""}`}
  strokeDasharray={circumference}
  strokeDashoffset={offset}
/>
                </svg>
                <div className="calorie-text">
  <div className="calorie-value">
    {summary?.totalCalories || 0}
  </div>

  <div className="calorie-total">
    / {calorieGoal} kcal
  </div>

  {isOver && (
    <div className="extra">
      +{(summary?.totalCalories || 0) - calorieGoal} kcal
    </div>
                  )}
                  {isTooMuch && (
    <div className="warning">
      Overeating 
    </div>
  )}
</div>
              </div>

         
              <div className="macros">
                <div className="macro-item">
                  <div className="macro-label">PROTEIN</div>
                  <div className="macro-value">
       {summary?.totalProtein || 0}g /  {proteinGoal}g
                </div>
                  <div className="macro-bar">
                   <div
  className="macro-progress"
  style={{
   width: `${Math.min((summary?.totalProtein / proteinGoal) * 100, 100)}%`,
    backgroundColor: '#29ff08'
  }}
/>
                  </div>
                </div>
                <div className="macro-item">
                  <div className="macro-label">CARBS</div>
                 <div className="macro-value">
  {summary?.totalCarbs || 0}g
</div>
                  <div className="macro-bar">
                    <div
  className="macro-progress"
  style={{
  width: `${Math.min(summary?.totalCarbs || 0, 100)}%` ,
    backgroundColor: '#00bdf7'
  }}
/>
                  </div>
                </div>
                <div className="macro-item">
                  <div className="macro-label">FATS</div>
                  <div className="macro-value">
 {summary?.totalFat || 0}g / {fatGoal}g
</div>
                  <div className="macro-bar">
                    <div
  className="macro-progress"
  style={{
  width: `${Math.min((summary?.totalFat / fatGoal) * 100, 100)}%`,
    backgroundColor: '#e7fc00'
  }}
/>
                  </div>
                </div>
              </div>

              <button className="edit-btn" onClick={() => setShowEdit(true)}>
  Edit Goals
              </button>
              
            </div>

            <div
  className="fuel-card"
  ref={(el) => (cardsRef.current[1] = el)}
>
              <h3>Log Performance Fuel</h3>
              <p className="fuel-subtitle">Powered by HimFit AI Nutrition Analysis</p>
              <textarea
  className="fuel-textarea"
  placeholder="What did you eat?"
  value={foodText}
  onChange={(e) => setFoodText(e.target.value)}
                          />
                          {successMsg && <p className="success">{successMsg}</p>}
{error && <p className="error">{error}</p>}
          <button
  className="analyze-btn"
  onClick={handleAnalyze}
  disabled={isLoading}
>
  {isLoading ? "Analyzing..." : "⚡ Analyze with AI"}
              </button>
              
              
            </div>
          </div>

          
          <div className="right-column">
           
            <div
  className="stats-container"
  ref={(el) => (cardsRef.current[2] = el)}
>
              <div className="stat-card">
                <div className="stat-header">
                  <h4>WATER INTAKE</h4>
                  <span className="stat-icon">💧</span>
                </div>
                <div className="stat-value">UNDER DEVELOPMENT PHASE</div>
                <div className="stat-sublabel">COMING SOON</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h4>STEPS</h4>
                  <span className="stat-icon">🚶</span>
                </div>
                <div className="stat-value">UNDER DEVELOPMENT PHASE</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h4>GOAL PROGRESS %</h4>
                  <span className="stat-icon">📈</span>
                </div>
                <div className="stat-value">
 {Math.round(
  ((summary?.totalCalories || 0) / calorieGoal) * 100
)}%
</div>
              </div>
            </div>

        
           <div
  className="recent-log-card"
  ref={(el) => (cardsRef.current[3] = el)}
>
              <div className="recent-header">
                <h3>Recent Performance Log</h3>
               <Link to="/history" className="view-history">
  VIEW HISTORY
</Link>
              </div>

            <div className="log-items">
  {foods.length === 0 ? (
    <p style={{ color: "#aaa" }}>No food logged yet</p>
  ) : (
    foods.slice(0, 5).map((item, index) => (
     <div
  className={`log-item ${index === 0 ? "active" : ""}`}
  key={item._id}
>
        
        <div className="log-icon">🍽️</div>

        <div className="log-details">
          <div className="log-name">{item.foodText}</div>

          <div className="log-time">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="log-calories">
          {item.calories} kcal
        </div>

      </div>
    ))
  )}
</div>
            </div>
          </div>
              </div>
              
       <footer className="dashboard-footer">
          <p>  RIGHTS RESERVED BY HIMANSHU.</p>
          <div className="footer-links">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">SUPPORT</a>
            <a
  href="https://www.instagram.com/himaanshushaarma?igsh=MW9idjJpODZ2dmpxeg=="
  target="_blank"
  rel="noopener noreferrer"
  className="support-link"
>
  CONTACT
</a>
          </div>
        </footer>
      </main>

 
          <audio ref={audioRef} src={successSound} />
     
          {showGoalPopup && (
  <div className="goal-popup">
     Goal Achieved! You hit {calorieGoal} kcal!
  </div>
          )}
          
          {isLoading && (
  <div className="loading-overlay">
    <div className="loader"></div>
    <p>Analyzing your meal with AI...</p>
  </div>
      )}
      
      {showEdit && (
  <div className="edit-overlay">
    <div className="edit-modal">

      <h2>Edit Goals</h2>

      <input
        type="number"
        placeholder="Calories"
        value={newCalories}
        onChange={(e) => setNewCalories(e.target.value)}
      />

      <input
        type="number"
        placeholder="Protein"
        value={newProtein}
        onChange={(e) => setNewProtein(e.target.value)}
      />

      <input
        type="number"
        placeholder="Fat"
        value={newFat}
        onChange={(e) => setNewFat(e.target.value)}
      />

      <button onClick={handleUpdate}>Save</button>
      <button onClick={() => setShowEdit(false)}>Cancel</button>

    </div>
  </div>
      )}
      
    </div>
  )
}
