import { NavLink } from "react-router-dom";
import gsap from "gsap";
export default function Sidebar({ handleLogout, isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <h1 className="brand-name">HIMFIT</h1>
            </div>

            <nav className="sidebar-nav">

              <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
 
  <span>Dashboard</span>
</NavLink>


               <NavLink
  to="/history"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  
  <span>History</span>
                </NavLink>


                
                <NavLink
  to="/coach"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  
  <span>Coach</span>
</NavLink>

                

                              <NavLink
  to="/profile"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  
  <span>Profile</span>
</NavLink>

            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                   
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}