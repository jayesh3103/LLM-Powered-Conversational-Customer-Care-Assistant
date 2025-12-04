from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS
import requests
import chatbot
import memory
import database
import json


import os
from dotenv import load_dotenv

load_dotenv()

database.init_db()

app = Flask(__name__)

CORS(app)  

API_URL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student"
HUGGING_FACE_API_TOKEN = os.getenv("HUGGING_FACE_API_TOKEN")


@app.route('/analyse-sentiment', methods=['POST'])
def analyse_sentiment():
    try:
        data = request.json
        text = data.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400
            
        output = query({
            "inputs": text,
        })
        
        if isinstance(output, list) and len(output) > 0:
            sentiment = find_highest_score(output[0])
            return jsonify({"sentiment": sentiment})
        else:
             return jsonify({"error": "Unexpected response from sentiment API", "details": output}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/product-info', methods=['POST'])
def product_info():
    try:
        data = request.json
        query_text = data.get('query')
        if not query_text:
            return jsonify({"error": "No query provided"}), 400

        def generate():
            for token in chatbot.get_answer_generator(query_text):
                yield token

        return Response(stream_with_context(generate()), mimetype='text/plain')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    

def query(payload):
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
	

def find_highest_score(output):
    # Initialize variables to hold the highest score and its corresponding label
    highest_score = 0
    highest_label = None
    
    # Iterate through each entry in the output variable
    for entry in output:
        # Check if the current score is higher than the highest score found so far
        if entry['score'] > highest_score:
            # Update the highest score and its corresponding label
            highest_score = entry['score']
            highest_label = entry['label']
    
    return highest_label

@app.route('/customer-service', methods=['POST'])
def customer_service():
    try:
        data = request.json
        query_text = data.get('query')
        if not query_text:
             return jsonify({"error": "No query provided"}), 400
             
        output = memory.get_answer(query_text)
        return jsonify({"answer": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/escalate', methods=['POST'])
def escalate():
    try:
        data = request.json
        history = data.get('history')
        if not history:
            return jsonify({"error": "No history provided"}), 400
            
        req_id = database.save_human_request(json.dumps(history))
        return jsonify({"message": "Request escalated to human agent", "request_id": req_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
