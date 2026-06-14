import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

MODEL_PATH = "churn_model.pkl"

def build_features(customer):
    inactive = customer.get("inactiveDays", 999)
    orders   = customer.get("totalOrders", 0)
    spent    = customer.get("totalSpent", 0)

    # Derived features
    avg_order_value = spent / max(orders, 1)
    order_frequency = orders / max(inactive, 1) * 30  # orders per 30 days

    recency_score = max(0, 100 - inactive)
    frequency_score = min(100, orders * 10)
    monetary_score = min(100, spent / 500)
    rfm = (recency_score + frequency_score + monetary_score) / 3

    return [
        inactive,
        orders,
        spent,
        avg_order_value,
        order_frequency,
        rfm,
        recency_score,
        frequency_score,
        monetary_score,
    ]

def generate_training_data():
    np.random.seed(42)
    n = 2000
    records = []

    for _ in range(n):
        inactive = np.random.exponential(60)
        orders   = np.random.poisson(4)
        spent    = max(0, np.random.normal(8000, 6000))

        avg_order = spent / max(orders, 1)
        order_freq = orders / max(inactive, 1) * 30

        recency   = max(0, 100 - inactive)
        frequency = min(100, orders * 10)
        monetary  = min(100, spent / 500)
        rfm = (recency + frequency + monetary) / 3

        # Churn probability based on real logic
        churn_prob = 0.1
        if inactive > 90:  churn_prob += 0.5
        elif inactive > 45: churn_prob += 0.3
        elif inactive > 20: churn_prob += 0.1

        if orders <= 1:  churn_prob += 0.3
        elif orders <= 3: churn_prob += 0.15

        if spent < 1000:  churn_prob += 0.2
        elif spent < 5000: churn_prob += 0.1

        churn_prob = min(1.0, churn_prob + np.random.normal(0, 0.05))
        churned = 1 if churn_prob > 0.55 else 0

        records.append([inactive, orders, spent, avg_order, order_freq,
                        rfm, recency, frequency, monetary, churned])

    df = pd.DataFrame(records, columns=[
        "inactive_days", "total_orders", "total_spent",
        "avg_order_value", "order_frequency", "rfm_score",
        "recency_score", "frequency_score", "monetary_score", "churned"
    ])
    return df

def train_model():
    df = generate_training_data()
    X = df.drop("churned", axis=1)
    y = df["churned"]

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", GradientBoostingClassifier(n_estimators=200, learning_rate=0.05,
                                            max_depth=4, random_state=42))
    ])
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")
    return model

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("No model found — training now...")
        return train_model()
    return joblib.load(MODEL_PATH)

def predict_customer(model, customer):
    features = np.array([build_features(customer)])
    churn_prob = float(model.predict_proba(features)[0][1])

    inactive = customer.get("inactiveDays", 999)
    orders   = customer.get("totalOrders", 0)
    spent    = customer.get("totalSpent", 0)

    # Survival probability at different time windows
    # Models how likely the customer survives X more days
    decay = churn_prob
    surv_14  = max(0.01, round(1 - decay * 0.15, 3))
    surv_30  = max(0.01, round(1 - decay * 0.30, 3))
    surv_90  = max(0.01, round(1 - decay * 0.65, 3))
    surv_180 = max(0.01, round(1 - decay * 0.90, 3))

    # Time-to-churn window
    if churn_prob >= 0.80:
        time_window = "likely to leave within 2 weeks"
        urgency = "CRITICAL"
        offer_type = "50% discount + personal call"
    elif churn_prob >= 0.65:
        time_window = "likely to leave within 1 month"
        urgency = "HIGH"
        offer_type = "Win-back campaign with discount"
    elif churn_prob >= 0.45:
        time_window = "may leave within 3 months"
        urgency = "MEDIUM"
        offer_type = "Loyalty reward or upsell campaign"
    elif churn_prob >= 0.25:
        time_window = "retention risk in 6 months"
        urgency = "LOW"
        offer_type = "Engagement email or referral program"
    else:
        time_window = "likely to stay beyond 6 months"
        urgency = "SAFE"
        offer_type = "Keep engaged with value content"

    return {
        "churnProbability": round(churn_prob * 100, 1),
        "survival14Days":   round(surv_14 * 100, 1),
        "survival30Days":   round(surv_30 * 100, 1),
        "survival90Days":   round(surv_90 * 100, 1),
        "survival180Days":  round(surv_180 * 100, 1),
        "predictedTimeWindow": time_window,
        "urgency": urgency,
        "offerType": offer_type,
    }