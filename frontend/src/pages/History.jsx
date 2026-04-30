import { useEffect, useState, useRef } from "react"
import api from "../api/axios"
import './History.scss'
import { Link, useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"
import gsap from "gsap";
export default function History() {
    const [foods, setFoods] = useState([])
    const [successMsg, setSuccessMsg] = useState("")
    const [summary, setSummary] = useState(null)
    const [filter, setFilter] = useState("today")
  const navigate = useNavigate()
  const pageRef = useRef(null);
const itemsRef = useRef([]);


   const storedUser =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user"));

const calorieGoal = storedUser?.goalCalories ?? 2000;
const proteinGoal = storedUser?.goalProtein ?? 100;
  const firstName = storedUser?.username || "User";

    const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  navigate("/")
}

 const handleDelete = async (id) => {
  try {
    await api.delete(`/api/food/${id}`)

    setFoods((prev) => prev.filter(item => item._id !== id))

    setSuccessMsg("Item deleted ✅")
    setTimeout(() => setSuccessMsg(""), 2000)

  } catch (err) {
    console.log(err)
  }
    }

    
    const filteredFoods = foods.filter((item) => {
  const itemDate = new Date(item.createdAt)
  const now = new Date()

  if (filter === "today") {
    return itemDate.toDateString() === now.toDateString()
  }

  if (filter === "week") {
    const weekAgo = new Date()
    weekAgo.setDate(now.getDate() - 7)
    return itemDate >= weekAgo
  }

  return true 
    })
    
useEffect(() => {
  gsap.fromTo(
    pageRef.current,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
  );
}, []);
  
  
  useEffect(() => {
  if (!itemsRef.current.length) return;

  gsap.fromTo(
    itemsRef.current,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power3.out",
    }
  );
  }, [filteredFoods]); 
  
 useEffect(() => {
  const fetchData = async () => {
    try {
    
      const res = await api.get("/api/food")
      setFoods(res.data.data)

     
      const summaryRes = await api.get("/api/food/summary")
      setSummary(summaryRes.data)

    } catch (err) {
      console.log(err)
    }
  }

  fetchData()
 }, [])
    
    useEffect(() => {
  itemsRef.current = [];
    }, [filteredFoods]);
  
  return (
      <div ref={pageRef} className="history-page">
            {successMsg && <p className="success">{successMsg}</p>}
    
      <main className="history-content">
        <header className="history-header">
          <div>
            <h1>Food History</h1>
            <p>Track your nutrition performance and discipline.</p>
          </div>
          <div className="history-filter">
           <button
  className={`filter-button ${filter === "today" ? "active" : ""}`}
  onClick={() => setFilter("today")}
>
  Today
</button>

<button
  className={`filter-button ${filter === "week" ? "active" : ""}`}
  onClick={() => setFilter("week")}
>
  Week
</button>

<button
  className={`filter-button ${filter === "all" ? "active" : ""}`}
  onClick={() => setFilter("all")}
>
  All
</button>
          </div>
        </header>

        <section className="summary-cards">
          <article className="summary-card">
            <span className="summary-label">DAILY TARGET</span>
<div className="summary-value">
  {calorieGoal} kcal
</div>
          </article>
          <article className="summary-card">
            <span className="summary-label">CONSUMED</span>
            <div className="summary-value highlight">
  {summary?.totalCalories || 0} kcal
</div>
 
          </article>
          <article className="summary-card">
            <span className="summary-label">PROTEIN</span>
<div className="summary-value accent">
  {summary?.totalProtein || 0}g / {proteinGoal}g
</div>
          </article>
          <article className="summary-card">
            <span className="summary-label">REMAINING</span>
<div className="summary-value">
  {Math.max(calorieGoal - (summary?.totalCalories || 0), 0)} kcal
</div>
          </article>
        </section>

        <section className="timeline-section">
          <div className="timeline-line" />
          
{filteredFoods.length === 0 ? (
  <p style={{ color: "#aaa" }}>No food history</p>
) : (
  filteredFoods.map((item, i) => (
    <article
      key={item._id}
      ref={(el) => (itemsRef.current[i] = el)}
      className="timeline-card"
    >
          <button
  className="delete-btn"
  onClick={() => handleDelete(item._id)}
>
  🗑
</button>
          <img
    className="food-thumb"
    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
    alt="food"
  />
      
      <div className="timeline-card-body">
        <div className="timeline-card-title">
          {item.foodText}
        </div>

        <div className="timeline-card-meta">
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="nutrition-tags">
          <span>P: {item.protein}g</span>
          <span>C: {item.carbs}g</span>
          <span>F: {item.fat}g</span>
        </div>
      </div>

      <div className="timeline-card-value">
        {item.calories} kcal
      </div>

    </article>
  ))
                  )}
                  </section>

     
   

        <footer className="history-footer">
          <p> RIGHTS RESERVED BY HIMANSHU.</p>
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
    </div>
  )
}
