# flask-backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from paddleocr import PaddleOCR,draw_ocr
from flask_cors import CORS;
import os
import cv2
from matplotlib import pyplot as plt
from fuzzywuzzy import fuzz
from Comparsion.comapre_texts_bbs import compare_text_elements
import numpy as np

app = Flask(__name__)

CORS(app)
app.static_url_path = '/static'
app.static_folder = 'static'

ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/upload-and-extract', methods=['POST'])
def upload_and_extract_text():
     try:
        originalMap = request.files.getlist('original')
        reproducedMap = request.files.getlist('reproduced')
        annotated_img_urls=[]
        Extracted_texts=[]
        Extracted_texts_BB=[]
        matching_results = []
        if not originalMap or not reproducedMap:
           return jsonify({"error": "No files Provided"}), 400
               
        for original_map, reproduced_map in zip(originalMap, reproducedMap):  

             print("========================================")
             print("Extraction Process Started") 
             print("========================================")
             try:
                orginal_result = process_extraction(original_map)
                reproduced_result = process_extraction(reproduced_map)
             except Exception as e:
                print("Error", e)    
                
             print("========================================")
             print("Extraction Process Finished") 
             print("========================================")       
             annotated_img_urls.append({
                    "original_img_url":orginal_result['image_url'],
                    "reproduced_img_url":reproduced_result['image_url']
                })
            
             Extracted_texts.append({
                "original_texts":orginal_result['extracted_text'],
                "reproduced_texts":reproduced_result['extracted_text']
            })
             Extracted_texts_BB.append({
                "original_list": orginal_result['BB_texts'],
                "reproduced_list":reproduced_result['BB_texts'],
            })
            
             response_data = {
                    "Texts_BBS":Extracted_texts_BB
                }
             #print(response_data)
        
        original_element= Extracted_texts_BB[0]["original_list"]
        reproduced_element=Extracted_texts_BB[0]["reproduced_list"]
        print("og_text_length",len(original_element))
        print("RP_text_lenght",len(reproduced_element))
        #print(response_data)
        matching_results = compare_text_elements(original_element, reproduced_element)
    
        ''''max_length=max(len(original_element),len(reproduced_element))
        matching=''
        for i in range(max_length): 
            original_item=original_element[i] if i< len(original_element) else None
            reproduced_item=reproduced_element[i] if i< len(reproduced_element) else None
            if original_item :
                original_text_bounding_box, original_text = original_item
            else:
                if i>=len(original_element):
                    original_text="Orignal Map Text is not avalaible";   
                    matching = "No matching avaliable" 
            if reproduced_item:
               reproduced_text_bounding_box, reproduced_text = reproduced_item
            else:
                if i>=len(reproduced_element):
                    reproduced_text="Reproduced map text is not avaliable!"   
                    matching = "No matching avaliable"
               #print("original:",original_text_bounding_box)
            #Comparsion Criteria
            
            text_similarity_score = calculate_text_similarity(original_text, reproduced_text)
            bounding_box_overlap_ratio = calculate_bounding_box_overlap(original_text_bounding_box, reproduced_text_bounding_box)  
            final_score=calculate_overall_score(text_similarity_score,bounding_box_overlap_ratio)
            
            if text_similarity_score >= 0.6 and bounding_box_overlap_ratio >= 0.6:
                    match_status = "Match"
            else:
                    match_status = "No Match"
       
                 
                 
            matching_results.append({
                "Original Text": original_text ,
                "Reproduced Text": reproduced_text ,
                "Text Similarity Score": text_similarity_score,
                "Bounding Box Overlap Ratio": bounding_box_overlap_ratio,
                "Match Status": matching if matching else match_status, 
                "Final_score":final_score
                
                })
            '''     
        return jsonify({"matching_Results":matching_results}), 200
          
     except Exception as e:
              return {
            "image_url": "NO/Empty URL",  # You might return a placeholder or empty URL here
            "extracted_text": [],
            "scores": [],
            "error": str(e)  # Include the error message in the result
        }
                         
   
def process_extraction(image_file):
    BB_text=[]
    # Process the image, save and annotate it, and extract text as needed
    # Return the result as a dictionary with the image URL and extracted text
    
    image_path = 'uploads/' + image_file.filename
    print("Saving Image",image_path)
    try:
        image_file.save(image_path)
        print("Image saved successfully.")
        print("Processing image:", image_path)
        result = ocr.ocr(image_path)
        # Rest of your code...
    except Exception as e:
        print("Error processing image:", e)
   
    # Extracting detected components
    boxes = [res[0] for res in result[0]]
    texts = [res[1][0] for res in result[0]]
    scores = [res[1][1] for res in result[0]]
    
    for res in result[0]:
        BB=res[0] #Bounding Box
        text=res[1][0] #Texts
        BB_text.append((BB,text))
    
    # Annotate the image
    font_path = os.path.join('PaddleOCR', 'doc', 'fonts', 'latin.ttf')
    img = cv2.imread(image_path)
    #img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #img = cv2.cvtColor(img, cv2) 
    annotated = draw_ocr(img, boxes, font_path=font_path)
    
    annotated_image_path = 'static/annotated_images/' + image_file.filename
    cv2.imwrite(annotated_image_path, annotated)

    return {
        "image_url": annotated_image_path,
        "extracted_text": texts,
        "scores": scores,
        "BBs":boxes,
        "BB_texts":BB_text
    }
 

def calculate_bounding_box_overlap(box1, box2):
    # Calculate the coordinates of the intersection rectangle
    x1_1, y1_1 = box1[0]
    x2_1, y2_1 = box1[2]
    #print("orignal",x1_1,y1_1,x2_1,y2_1)
    x1_2, y1_2 = box2[0]
    x2_2, y2_2 = box2[2]
    #print("reproduced",x1_2,y1_2,x2_2,y2_2)
    # Calculate the coordinates of the intersection rectangle
    x1_intersection = max(x1_1, x1_2)
    x2_intersection = min(x2_1, x2_2)
    width_intersection = max(0, x2_intersection - x1_intersection)
    
    y1_intersection = max(y1_1, y1_2)
    y2_intersection = min(y2_1, y2_2)
    height_intersection = max(0, y2_intersection - y1_intersection)
    # Calculate the width and height of the intersection rectangle
    #print("H",height_intersection)
    if width_intersection > 0 and height_intersection > 0:
        # Calculate the area of the intersection rectangle
      intersection_area = width_intersection * height_intersection

        # Calculate the areas of each bounding box
      area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
      area2 = (x2_2 - x1_2) * (y2_2 - y1_2)

        # Calculate the Union (area of box1 + area of box2 - intersection area)
      union = area1 + area2 - intersection_area

      #print("Overlap Ratio:", overlap_ratio)
        # Calculate the IoU (intersection over union)
      overlap_ratio = intersection_area / union
    else:
        # If there is no intersection, overlap ratio is 0
      overlap_ratio = 0.0

    return overlap_ratio

def calculate_text_similarity(text1, text2):
    similarity_score = fuzz.ratio(text1, text2)
    return similarity_score

def calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio, text_weight=0.7, bounding_box_weight=0.3):
    overall_score = (text_weight * text_similarity_score) + (bounding_box_weight * bounding_box_overlap_ratio)
    return overall_score




@app.route('/annotated-images/<path:filename>',methods=['GET'])
def serve_annotated_image(filename):
    return send_from_directory('annotated_images', filename)

# Define a route for text comparison
@app.route('/compare-texts', methods=['GET'])
def compare_texts():
    try:
        data = request.get_json()
        original_text = data.get('original_text', '')
        comparison_text = data.get('comparison_text', '')        
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


