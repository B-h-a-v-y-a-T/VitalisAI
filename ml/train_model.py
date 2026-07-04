"""
Vitalis AI -- ML Engine
Trains a Logistic Regression model on UCI Heart Disease data.
Outputs integer-scaled coefficients suitable for FHE smart contract execution.

Features used (all integer-safe):
  age      - Age in years
  sex      - Sex (1 = male, 0 = female)
  trestbps - Resting blood pressure (mm Hg)
  chol     - Serum cholesterol (mg/dl)
  fbs      - Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  thalach  - Maximum heart rate achieved
"""

import json
import os
import sys

# Check dependencies
try:
    import pandas as pd
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, classification_report
    from sklearn.preprocessing import StandardScaler
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install pandas scikit-learn")
    import pandas as pd
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, classification_report
    from sklearn.preprocessing import StandardScaler

# --- Configuration ---
FEATURES = ['age', 'sex', 'trestbps', 'chol', 'fbs', 'thalach']
TARGET = 'target'
SCALE_FACTOR = 1000  # Multiply float coefficients by this to get integers
RANDOM_STATE = 42

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'heart.csv')
    output_path = os.path.join(script_dir, 'model_weights.json')
    
    # --- Load Data ---
    print("=" * 60)
    print("VITALIS AI -- Logistic Regression Training Pipeline")
    print("=" * 60)
    
    df = pd.read_csv(csv_path)
    print(f"\nDataset loaded: {len(df)} rows, {len(df.columns)} columns")
    print(f"Features selected: {FEATURES}")
    print(f"Target: {TARGET}")
    
    X = df[FEATURES].values
    y = df[TARGET].values
    
    print(f"\nClass distribution:")
    print(f"  No disease (0): {sum(y == 0)}")
    print(f"  Disease (1):    {sum(y == 1)}")
    
    # --- Train/Test Split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")
    
    # --- Train Model (no feature scaling -- raw integer inputs) ---
    # We skip StandardScaler intentionally because the FHE contract
    # will receive raw integer values (age=58, chol=240, etc.)
    # The model must learn on raw values so coefficients map directly.
    model = LogisticRegression(
        max_iter=1000,
        random_state=RANDOM_STATE,
        solver='lbfgs'
    )
    model.fit(X_train, y_train)
    
    # --- Evaluate ---
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n{'-' * 60}")
    print(f"MODEL PERFORMANCE")
    print(f"{'-' * 60}")
    print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.1f}%)")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Disease', 'Disease']))
    
    # --- Extract & Scale Coefficients ---
    raw_coefficients = model.coef_[0]
    raw_intercept = model.intercept_[0]
    
    print(f"{'-' * 60}")
    print(f"RAW COEFFICIENTS (float)")
    print(f"{'-' * 60}")
    for feat, coef in zip(FEATURES, raw_coefficients):
        print(f"  {feat:>10}: {coef:+.6f}")
    print(f"  {'intercept':>10}: {raw_intercept:+.6f}")
    
    # Scale by SCALE_FACTOR and round to integers
    scaled_coefficients = [int(round(c * SCALE_FACTOR)) for c in raw_coefficients]
    scaled_intercept = int(round(raw_intercept * SCALE_FACTOR))
    
    print(f"\n{'-' * 60}")
    print(f"SCALED COEFFICIENTS (x{SCALE_FACTOR}, integer)")
    print(f"{'-' * 60}")
    for feat, coef in zip(FEATURES, scaled_coefficients):
        print(f"  {feat:>10}: {coef:+d}")
    print(f"  {'intercept':>10}: {scaled_intercept:+d}")
    
    # --- Split into Positive / Negative arrays ---
    # This is the key FHE trick: since euint32 can't be negative,
    # we split weights into two arrays and compute two separate sums.
    positive_weights = []
    negative_weights = []
    
    for coef in scaled_coefficients:
        if coef >= 0:
            positive_weights.append(coef)
            negative_weights.append(0)
        else:
            positive_weights.append(0)
            negative_weights.append(abs(coef))
    
    # Handle intercept the same way
    if scaled_intercept >= 0:
        positive_intercept = scaled_intercept
        negative_intercept = 0
    else:
        positive_intercept = 0
        negative_intercept = abs(scaled_intercept)
    
    # Threshold: we use 0 as the decision boundary in logistic regression
    # (predict 1 if wx + b >= 0, i.e., positive_score >= negative_score + |negative_intercept|)
    # The threshold absorbs the intercept offset
    threshold = negative_intercept  # This ensures: posScore + posIntercept >= negScore + negIntercept + 0
    
    print(f"\n{'-' * 60}")
    print(f"FHE-SAFE WEIGHT ARRAYS")
    print(f"{'-' * 60}")
    print(f"  positiveWeights: {positive_weights}")
    print(f"  negativeWeights: {negative_weights}")
    print(f"  positiveIntercept: {positive_intercept}")
    print(f"  negativeIntercept: {negative_intercept}")
    print(f"  threshold (absorbs intercept): {threshold}")
    
    # --- Output JSON ---
    output = {
        "model": "LogisticRegression",
        "features": FEATURES,
        "scale_factor": SCALE_FACTOR,
        "accuracy": round(accuracy, 4),
        "raw_coefficients": [round(c, 6) for c in raw_coefficients.tolist()],
        "raw_intercept": round(raw_intercept, 6),
        "scaled_coefficients": scaled_coefficients,
        "scaled_intercept": scaled_intercept,
        "positive_weights": positive_weights,
        "negative_weights": negative_weights,
        "positive_intercept": positive_intercept,
        "negative_intercept": negative_intercept,
        "threshold": threshold,
        "num_features": len(FEATURES),
    }
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n[OK] Model weights saved to: {output_path}")
    print(f"{'=' * 60}")
    
    return output

if __name__ == '__main__':
    main()
