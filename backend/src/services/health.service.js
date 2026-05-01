
const convertHeightToCm = (height, unit) => {
  if (unit === "cm") return height;

  
  return height * 30.48;
};

const convertWeightToKg = (weight, unit) => {
  if (unit === "kg") return weight;


  return weight * 0.453592;
};

const calculateHealth = ({
  heightInput,
  weightInput,
  heightUnit,
  weightUnit,
  age,
  gender,
  activityLevel,
  goal
}) => {


   const height = Number(heightInput);
  const weight = Number(weightInput);
  const ageNum = Number(age); 

 
 if (!height || !weight || height <= 0 || weight <= 0)  {
    return {
  heightCm: 0,
  weightKg: 0,
  bmi: 0,
  tdee: 0,
  recommendedCalories: 0
};
  }

 const heightCm = convertHeightToCm(height, heightUnit);
const weightKg = convertWeightToKg(weight, weightUnit);

 const heightCmNum = Number(heightCm);
const weightKgNum = Number(weightKg);

if (isNaN(heightCmNum) || isNaN(weightKgNum)) {
  throw new Error("Invalid height or weight");
}


const heightM = heightCmNum / 100;
const bmi = weightKgNum / (heightM * heightM);

  let bmr;

  if (gender === "male") {
   bmr = 10 * weightKgNum + 6.25 * heightCmNum - 5 * ageNum + 5;
  } else {
    bmr = 10 * weightKgNum + 6.25 * heightCmNum - 5 * ageNum - 161;
  }

  const activityMap = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };

  const tdee = bmr * (activityMap[activityLevel] || 1.2);

  let dailyCalories = tdee;

  if (goal === "weight_loss") {
    dailyCalories -= 500;
  } else if (goal === "muscle_gain") {
    dailyCalories += 300;
  }

 return {
  heightCm: Number(heightCmNum.toFixed(2)),
  weightKg: Number(weightKgNum.toFixed(2)),
  bmi: Number(bmi.toFixed(1)),
  tdee: Math.round(tdee),
recommendedCalories: Math.round(dailyCalories)
};
};


module.exports = {
  calculateHealth
};