// Base dataset structure
const generateBase = () => [
  { id: 1, age: 63, sex: 1, trestbps: 145, chol: 233, fbs: 1, thalach: 150 },
  { id: 2, age: 24, sex: 1, trestbps: 120, chol: 180, fbs: 0, thalach: 187 },
  { id: 3, age: 28, sex: 0, trestbps: 110, chol: 190, fbs: 0, thalach: 172 },
  { id: 4, age: 31, sex: 1, trestbps: 115, chol: 200, fbs: 0, thalach: 178 },
  { id: 5, age: 57, sex: 0, trestbps: 120, chol: 354, fbs: 0, thalach: 163 },
  { id: 6, age: 57, sex: 1, trestbps: 140, chol: 192, fbs: 0, thalach: 148 },
  { id: 7, age: 56, sex: 0, trestbps: 140, chol: 294, fbs: 0, thalach: 153 },
  { id: 8, age: 44, sex: 1, trestbps: 120, chol: 263, fbs: 0, thalach: 173 },
  { id: 9, age: 52, sex: 1, trestbps: 172, chol: 199, fbs: 1, thalach: 162 },
  { id: 10, age: 57, sex: 1, trestbps: 150, chol: 168, fbs: 0, thalach: 174 },
  { id: 11, age: 54, sex: 1, trestbps: 140, chol: 239, fbs: 0, thalach: 160 },
  { id: 12, age: 48, sex: 0, trestbps: 130, chol: 275, fbs: 0, thalach: 139 },
  { id: 13, age: 49, sex: 1, trestbps: 130, chol: 266, fbs: 0, thalach: 171 },
  { id: 14, age: 64, sex: 1, trestbps: 110, chol: 211, fbs: 0, thalach: 144 },
  { id: 15, age: 58, sex: 0, trestbps: 150, chol: 283, fbs: 1, thalach: 162 },
  { id: 16, age: 50, sex: 0, trestbps: 120, chol: 219, fbs: 0, thalach: 158 },
  { id: 17, age: 58, sex: 0, trestbps: 120, chol: 340, fbs: 0, thalach: 172 },
  { id: 18, age: 66, sex: 0, trestbps: 150, chol: 226, fbs: 0, thalach: 114 },
  { id: 19, age: 43, sex: 1, trestbps: 150, chol: 247, fbs: 0, thalach: 171 },
  { id: 20, age: 69, sex: 0, trestbps: 140, chol: 239, fbs: 0, thalach: 151 },
  { id: 21, age: 59, sex: 1, trestbps: 135, chol: 234, fbs: 0, thalach: 161 },
  { id: 22, age: 44, sex: 1, trestbps: 130, chol: 233, fbs: 0, thalach: 179 },
  { id: 23, age: 42, sex: 1, trestbps: 140, chol: 226, fbs: 0, thalach: 178 },
  { id: 24, age: 61, sex: 1, trestbps: 138, chol: 166, fbs: 0, thalach: 125 },
  { id: 25, age: 40, sex: 1, trestbps: 140, chol: 199, fbs: 0, thalach: 178 },
  { id: 26, age: 71, sex: 0, trestbps: 110, chol: 265, fbs: 1, thalach: 130 },
  { id: 27, age: 59, sex: 1, trestbps: 150, chol: 212, fbs: 1, thalach: 157 },
  { id: 28, age: 51, sex: 1, trestbps: 110, chol: 175, fbs: 0, thalach: 123 },
  { id: 29, age: 65, sex: 0, trestbps: 140, chol: 417, fbs: 1, thalach: 157 },
  { id: 30, age: 53, sex: 1, trestbps: 130, chol: 197, fbs: 1, thalach: 152 },
];

export const MOCK_PATIENT_DB = generateBase();

// Northeast: Generally older population, slightly higher baseline thalach
export const MOCK_PATIENT_DB_NORTHEAST = generateBase().map(p => ({
  ...p,
  age: p.age + Math.floor(Math.random() * 8), // Shift older
  thalach: p.thalach + 5
}));

// Midwest: Higher cholesterol average, slightly younger
export const MOCK_PATIENT_DB_MIDWEST = generateBase().map(p => ({
  ...p,
  age: Math.max(30, p.age - Math.floor(Math.random() * 6)), // Shift younger
  chol: p.chol + Math.floor(Math.random() * 40) + 10 // Shift cholesterol higher
}));

// South: Higher resting blood pressure (trestbps) and higher fasting blood sugar occurrences
export const MOCK_PATIENT_DB_SOUTH = generateBase().map(p => ({
  ...p,
  trestbps: p.trestbps + Math.floor(Math.random() * 20),
  fbs: Math.random() > 0.5 ? 1 : p.fbs
}));
