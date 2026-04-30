import "../styles/global.scss";
import "./Profile.scss";
import { useState, useEffect } from "react";
import api from "../api/axios";
import gsap from "gsap";
const Profile = () => {
  const [form, setForm] = useState({
    heightInput: "",
    heightUnit: "feet",
    weightInput: "",
    weightUnit: "kg",
    age: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "muscle_gain",
    dietType: "non-veg",
  });
  const [summary, setSummary] = useState(null);

const storedUser =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user"));

const calorieGoal = storedUser?.goalCalories ?? 2000;

    const [loading, setLoading] = useState(false);
    const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState("");
 

const totalCalories = summary?.totalCalories || 0;

const caloriePercent = Math.min(
  (totalCalories / calorieGoal) * 100,
  100
);

const isOver = totalCalories > calorieGoal;
  
  useEffect(() => {
  const fetchCalories = async () => {
    try {
      const res = await api.get("/api/food/summary");
      setSummary(res.data);
    } catch (err) {
      console.log("Error fetching calories", err);
    }
  };

  fetchCalories();
  }, []);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");

        setForm({
          heightInput: res.data.heightInput || "",
          heightUnit: res.data.heightUnit || "feet",
          weightInput: res.data.weightInput || "",
          weightUnit: res.data.weightUnit || "kg",
          age: res.data.age || "",
          gender: res.data.gender || "male",
          activityLevel: res.data.activityLevel || "moderate",
          goal: res.data.goal || "muscle_gain",
          dietType: res.data.dietType || "non-veg",
        });
      } catch (err) {
        console.log("Error loading profile", err);
      }
    };

    fetchProfile();
  }, []);

 useEffect(() => {
  const { heightInput, heightUnit, weightInput, weightUnit } = form;

  if (!heightInput || !weightInput) {
    setBmi(null);
    setBmiStatus("");
    return;
  }

  let heightInMeters;
  let weightInKg;

 
  if (heightUnit === "feet") {
    heightInMeters = heightInput * 0.3048;
  } else {
    heightInMeters = heightInput / 100;
  }

 
  if (weightUnit === "lbs") {
    weightInKg = weightInput * 0.453592;
  }
  
  else {
    weightInKg = weightInput;
  }

  const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);

  const rounded = calculatedBmi.toFixed(1);
  setBmi(rounded);

 
  if (rounded < 18.5) setBmiStatus("Underweight");
  else if (rounded < 25) setBmiStatus("Healthy");
  else if (rounded < 30) setBmiStatus("Overweight");
  else setBmiStatus("Obese");

}, [form]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await api.put("/api/user/profile", form);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile saved successfully");
    } catch (err) {
      console.log(err);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };


  const handleReset = () => {
    setForm({
      heightInput: "",
      heightUnit: "feet",
      weightInput: "",
      weightUnit: "kg",
      age: "",
      gender: "male",
      activityLevel: "moderate",
      goal: "muscle_gain",
      dietType: "non-veg",
    });
    };
    
    const handleUnitChange = (e) => {
  const { name, value } = e.target;

  let newForm = { ...form };


  if (name === "heightUnit") {
    if (value === "cm" && form.heightUnit === "feet") {
      newForm.heightInput = (form.heightInput * 30.48).toFixed(1);
    } else if (value === "feet" && form.heightUnit === "cm") {
      newForm.heightInput = (form.heightInput / 30.48).toFixed(2);
    }
  }

 
  if (name === "weightUnit") {
    if (value === "kg" && form.weightUnit === "lbs") {
      newForm.weightInput = (form.weightInput * 0.453592).toFixed(1);
    } else if (value === "lbs" && form.weightUnit === "kg") {
      newForm.weightInput = (form.weightInput / 0.453592).toFixed(1);
    }
  }

  newForm[name] = value;

  setForm(newForm);
    };
    
const fields = [
  form.heightInput,
  form.weightInput,
  form.age,
  form.gender,
  form.goal,
  form.activityLevel,
  form.dietType
];

const filled = fields.filter(Boolean).length;
const total = fields.length;

    
 return (
  <div className="profile-page">
    <div className="profile-main">
      <h1>Profile</h1>
      <p>Manage your fitness data and goals</p>

      <div className="profile-grid">

       
        <div className="profile-left">

       
          <div className="card personal">
            <h3>Personal Information</h3>

            <div className="grid-2">
              <div className="field">
                <label>HEIGHT</label>
                <div className="input-wrap">
                 <input
  type="number"
  name="heightInput"
  placeholder={form.heightUnit === "feet" ? "5.8" : "170"}
  value={form.heightInput}
  onChange={handleChange}
/>
                  <select
                    name="heightUnit"
                    value={form.heightUnit}
                    onChange={handleUnitChange}
                  >
                    <option value="feet">FT</option>
                    <option value="cm">CM</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>WEIGHT</label>
                <div className="input-wrap">
                 <input
  type="number"
  name="weightInput"
  placeholder={form.weightUnit === "kg" ? "70" : "154"}
  value={form.weightInput}
  onChange={handleChange}
/>
                  <select
                    name="weightUnit"
                    value={form.weightUnit}
                    onChange={handleUnitChange}
                  >
                    <option value="kg">KG</option>
                    <option value="lbs">LBS</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>AGE</label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>GENDER</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
             </div>
             
          </div>

          <div className="card fitness">
            <h3>Fitness Preferences</h3>

            <div className="activity">
              <span>ACTIVITY LEVEL</span>
              <div className="activity-buttons">
                {["sedentary", "light", "moderate", "active"].map((lvl) => (
                  <button
                    key={lvl}
                    className={form.activityLevel === lvl ? "active" : ""}
                    onClick={() =>
                      setForm({ ...form, activityLevel: lvl })
                    }
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>PRIMARY GOAL</label>
                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                >
                  <option value="weight_loss">Fat Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintain">Maintain</option>
                </select>
              </div>

              <div className="field">
                <label>DIET TYPE</label>
                <select
                  name="dietType"
                  value={form.dietType}
                  onChange={handleChange}
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>

            <div className="btn-row">
              <button className="save" onClick={handleSave}>
                {loading ? "Saving..." : "Save Profile"}
              </button>

              <button className="reset" onClick={handleReset}>
                Reset Changes
              </button>
            </div>
          </div>

        </div>

      
        <div className="profile-right">

          <div className="card bmi">
            <h4>CALCULATED BMI</h4>
            <h2>{bmi || "--"}</h2>
            <span className="status">{bmiStatus || "Enter data"}</span>

            <div className="bmi-bar">
              <div
                className="bar-fill"
                style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

           <div className="card strength">
  <h4>DAILY CALORIES</h4>

  <div className="circle-wrapper">
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" className="circle-bg" />

    <circle
  cx="50"
  cy="50"
  r="45"
  className={`circle-progress ${isOver ? "danger" : ""}`}
  strokeDasharray={283}
strokeDashoffset={283 - (caloriePercent / 100) * 283}
/>
    </svg>

    <div className="circle-text">
  {Math.round(caloriePercent)}%
</div>
  </div>

  <p>  {totalCalories} / {calorieGoal} kcal</p>
</div>
                     
                     
          </div>

        </div>

     </div>
      <footer className="profile-footer">
          <p>RIGHTS RESERVED BY HIMANSHU.</p>
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
    </div>
 
);
};

export default Profile;