import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
export default function Layout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
const location = useLocation();
  const pageRef = useRef(null);


  useEffect(() => {
  setIsSidebarOpen(false);
  }, [location]);
  
  
  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div ref={pageRef} className="app-layout">
      
      <Sidebar 
  handleLogout={handleLogout} 
        isOpen={isSidebarOpen}
         setIsSidebarOpen={setIsSidebarOpen} 
      />
      {isSidebarOpen && (
  <div 
    className="overlay"
    onClick={() => setIsSidebarOpen(false)}
  ></div>
)}

          <div className="main-content">
              
              <button 
      className="menu-btn"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      ☰
              </button>
              
        <Outlet />  
      </div>
    </div>
  );
}