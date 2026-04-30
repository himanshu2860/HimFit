
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

  // ✅ FIX: validation inside function
  if (!heightInput || !weightInput || heightInput <= 0 || weightInput <= 0) {
    return {
      heightCm: 0,
      weightKg: 0,
      bmi: 0,
      tdee: 0,
      dailyCalories: 0
    };
  }

  const heightCm = convertHeightToCm(heightInput, heightUnit);
  const weightKg = convertWeightToKg(weightInput, weightUnit);

  const heightM = heightCm / 100;

  const bmi = weightKg / (heightM * heightM);

  let bmr;

  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
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
    heightCm: Number(heightCm.toFixed(2)),
    weightKg: Number(weightKg.toFixed(2)),
    bmi: Number(bmi.toFixed(1)),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(dailyCalories)
  };
};


module.exports = {
  calculateHealth
};