from flask import Flask, request, jsonify
import os, requests

app = Flask(__name__)
HF_TOKEN = os.getenv("HF_TOKEN")

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/summarize", methods=["POST"])
def summarize():
    text = request.json.get("text", "")
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    r = requests.post(
        "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
        headers=headers,
        json={"inputs": text}
    )
    data = r.json()
    return jsonify({"summary": data[0]["summary_text"]})

app.run(host="0.0.0.0", port=int(os.getenv("PORT", 3000)))
