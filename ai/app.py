from flask import Flask, request, jsonify
from transformers import pipeline
import os

app = Flask(__name__)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text", "")
    if len(text.strip()) < 20:
        return jsonify({"summary": "Text too short to summarize"}), 400

    result = summarizer(text, max_length=40, min_length=10, do_sample=False)
    return jsonify({"summary": result[0]["summary_text"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
