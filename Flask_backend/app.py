# flask-backend/app.py
from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
from flask_cors import CORS;
import os
from padd import maptotext

app = Flask(__name__)

CORS(app)
# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/')
def hello():
    return "Hello World,joye"
@app.route('/uploadmapgetext', methods=['POST'])
def mapupload_gettext():
    file=maptotext()
    return file

@app.route('/upload-and-extract', methods=['POST'])
def upload_and_extract_text():
   
    try:
        uploaded_file = request.files['file']
        print(uploaded_file)
        if uploaded_file!='':
            print("I got the File to server")
            
        if uploaded_file.filename != '':
            # Save the uploaded file temporarily
            image_path = 'uploads/' + uploaded_file.filename
            uploaded_file.save(image_path)
            print(image_path)
            # Perform OCR on the uploaded image
            result = ocr.ocr(image_path)
            
            # Extract the text from the OCR result
            extracted_text = ""
            for line in result[0]:
               extracted_text = line[0][1]
               print(extracted_text)
            # Create a response JSON
            response_data = {
                "extracted_text": extracted_text
            }
            
            return jsonify(response_data), 200
        else:
            return jsonify({"error": "No file provided"}), 400
    except Exception as e:
        return jsonify({"error": str(e) + "Error in files"}), 500
# flask-backend/app.py

# ... (previous code) ...

# Define a route for text comparison
@app.route('/compare-texts', methods=['POST'])
def compare_texts():
    try:
        data = request.get_json()
        original_text = data.get('original_text', '')
        comparison_text = data.get('comparison_text', '')
        
        # Implement your text comparison logic here
        # For example, you can use difflib, Levenshtein distance, etc.
        # Compare the original_text and comparison_text and generate a comparison result
        
        comparison_result = "Comparison result goes here"
        
        # Create a response JSON
        response_data = {
            "comparison_result": comparison_result
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,host="127.0.0.1",port=5000)


