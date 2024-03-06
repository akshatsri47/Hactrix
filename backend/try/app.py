import os
import base64

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

op_dest = "C:/Users/aksha/OneDrive/Desktop/HANDSIGN-HACTRIX/backend/try/filtered_data/"
alpha_dest = "C:/Users/aksha/OneDrive/Desktop/HANDSIGN-HACTRIX/backend/try/alphabet/"

# Load files and create mapping
file_map = {}
for filename in os.listdir(op_dest):
    if filename.endswith(".webp"):
        tmp = filename.replace(".webp", "").split()
        file_map[filename] = tmp

# Function to generate sign language GIF from text
def generate_sign_language_gif(text):
    all_frames = []
    words = text.split()
    for word in words:
        flag, sim = check_similarity(word, file_map)
        if flag == -1:
            for character in word:
                image_path = os.path.join(alpha_dest, f"{character.lower()}_small.gif")
                all_frames.append(read_gif_bytes(image_path))
        else:
            all_frames.append(read_gif_bytes(os.path.join(op_dest, sim)))
    return all_frames

# Function to check similarity in the dictionary
def check_similarity(word, file_map):
    for item, words in file_map.items():
        if word in words:
            return 1, item
    return -1, ""

# Function to read GIF bytes from file
def read_gif_bytes(file_path):
    with open(file_path, 'rb') as f:
        gif_bytes = f.read()
    return base64.b64encode(gif_bytes).decode('utf-8')  # Encode bytes to Base64 string

# Routes for API
@app.route('/text-to-sign', methods=['POST'])
def text_to_sign():
    try:
        data = request.json
        input_text = data.get('text', '')

        if not input_text:
            return jsonify({'error': 'Text not provided.'}), 400

        gif_frames = generate_sign_language_gif(input_text)
        return jsonify({'gif_frames': gif_frames}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
