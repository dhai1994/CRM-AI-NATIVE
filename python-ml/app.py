from flask import Flask, request, jsonify
from flask_cors import CORS
from model import load_model, predict_customer

app = Flask(__name__)
CORS(app)

model = load_model()

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    customers = data.get("customers", [])
    results = []
    for c in customers:
        pred = predict_customer(model, {
            "inactiveDays": c.get("inactiveDays", 999),
            "totalOrders":  c.get("totalOrders", 0),
            "totalSpent":   c.get("totalSpent", 0),
        })
        results.append({ "_id": c.get("_id"), **pred })
    return jsonify(results)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=8000, debug=True)