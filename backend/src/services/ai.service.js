const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const nutritionSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  message: z.string()
})


async function getFoodNutrition(foodText) {

  const prompt = `
You are a smart but strict fitness coach.

Analyze this food:
"${foodText}"

Return JSON:
- calories
- protein (grams)
- carbs (grams)
- fat (grams)
- message

Rules:
- Be realistic (no fake numbers)
- Consider Indian foods if applicable
- Message tone:
  - Slightly strict 😤
  - Motivating 💪
  - Hinglish allowed
  - Can use light pahadi slang like "bhai tu kya kar raha hai", "ye theek ni hai"

Message example:
"😤 Bhai ye thoda heavy ho gaya.
Protein theek hai but carbs zyada ho gaye.
Control kar warna fat badhega!"

IMPORTANT:
- ONLY return valid JSON
- No extra text
- Numbers must be numbers
`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(nutritionSchema)
      }
    })

    console.log("RAW AI RESPONSE:", response.text)


    let cleanText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let result

    try {
      result = JSON.parse(cleanText)
    } catch (parseError) {
      console.log("JSON PARSE ERROR:", parseError)
      console.log("INVALID JSON:", cleanText)

      throw new Error("Invalid JSON from AI")
    }

    console.log("PARSED RESULT:", result)

    return result

  } catch (err) {
    console.log("AI Error:", err)

    if (err.status === 429 || err.code === 429) {
      return {
        calories: 100,
        protein: 10,
        carbs: 10,
        fat: 5,
        message: "⚠️ AI busy hai bhai, abhi estimate de raha hu. Thoda wait kar."
      }
    }

    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      message: "⚠️ System down hai bhai. Dobara try kar."
    }
  }
}

async function askFitnessCoach(user, message) {

const genderTone =
  user.gender === "female"
    ? "Use a friendly and supportive tone like 'yaar', 'girl', keep it respectful, motivating, and positive"
    : user.gender === "male"
    ? "Use a friendly bro tone like 'bhai', 'bro', encouraging and motivating but not harsh"
    : "Use a neutral, friendly tone";

const prompt = `
You are a FRIENDLY and MOTIVATING fitness coach.

Personality:
- Positive, encouraging, and practical 
- Hinglish allowed
- Can use light humor (NO harsh sarcasm)
- Slightly playful but always respectful
- Focus on helping user improve, not judging them

Tone Rules:
- ${genderTone}
- Keep tone supportive, not rude or aggressive

User Details:
- Age: ${user.age || "unknown"}
- Gender: ${user.gender || "unknown"}
- Height: ${user.heightCm || "unknown"} cm
- Weight: ${user.weightKg || "unknown"} kg
- BMI: ${user.bmi || "unknown"}
- Goal: ${user.goal || "unknown"}
- Activity Level: ${user.activityLevel || "unknown"}
- Diet Type: ${user.dietType || "unknown"}
--- USER GOALS ---
- Goal Calories: ${user.goalCalories || "not set"}
- Protein Goal: ${user.proteinGoal || "not set"}
- Fat Goal: ${user.fatGoal || "not set"}

--- SYSTEM CALCULATED ---
- Recommended Calories: ${user.recommendedCalories || "unknown"} (system calculated)

User Question:
"${message}"

Instructions:
- MUST refer to at least 1 user metric (BMI, weight, goal, or calories)
- Match advice with user's goal (fat loss / muscle gain / maintain)
- If BMI is high → gently guide toward fat loss
- If BMI is low → guide toward muscle gain
- Keep response within 4 to 5 lines
- Give simple, practical advice
- Add 1 light, friendly humorous/motivational line (no insults)
- Stay respectful and helpful
- MUST refer to at least 1 user metric (BMI, weight, goal, or calories)

- ALWAYS compare:
  - Goal Calories vs Recommended Calories

- Logic:
  - If goalCalories < recommendedCalories → user is in calorie deficit
  - If goalCalories > recommendedCalories → user is in surplus

- Explain if this is:
  - Good
  - Too aggressive
  - Needs adjustment

- Also consider:
  - proteinGoal → is it enough?
  - fatGoal → is it balanced?

- Give advice based on BOTH:

  (user goals + system calculations)


  - When referring to recommended calories, call it "approx target" not strict goal
Examples:

Male:
"Bhai tera goal ${user.goalCalories} hai, lekin system ke hisaab se ${user.recommendedCalories} approx target hai.
Tu deficit me chal raha hai — fat loss ke liye sahi hai.
Bas protein high rakh warna muscle loss ho jayega.
Consistency hi game changer hai bro 💪"

Female:
"Yaar tera goal ${user.goalCalories} hai, aur system approx ${user.recommendedCalories} suggest karta hai.
Thoda difference hai but manageable hai.
Balanced diet + protein intake maintain karo.
You got this girl 💖"

Do NOT:
- Be rude, insulting, or aggressive
- Be creepy or flirty
- Shame the user

Be supportive, motivating, and realistic.
`;




  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    })

    return response.text

  } catch (err) {
    console.log("Coach AI Error:", err)

    return "Bhai server busy hai, par sun — junk khayega toh abs nahi aayenge. Discipline la!"
  }
}

module.exports = {
  getFoodNutrition,
  askFitnessCoach
}