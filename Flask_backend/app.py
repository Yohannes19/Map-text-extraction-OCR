# flask-backend/app.py
import re
from flask import Flask, request, jsonify, send_file, send_from_directory,g
from paddleocr import PaddleOCR,draw_ocr
from flask_cors import CORS;
import os
import cv2
from matplotlib import pyplot as plt
from thefuzz import fuzz 
#from thefuzz.utils import full_process
#from rapidfuzz import fuzz
#from Comparsion.comapre_texts_bbs import compare_text_elements
from Comparsion.BB_distance import calculate_distance_between_bounding_boxes
from Comparsion.text_similarity import dynamic_string_comparison

from gevent import config as gevent_config


app = Flask(__name__)

gevent_config.MAX_TIMEOUT = 600 

CORS(app)
app.static_url_path = '/static'
app.static_folder = 'static'
#REACT_FRONTEND_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'React_Frontend/build')
ANNOTATED_IMAGES_DIR='static/annotated_images/'
selected_language = 'en'  # Default language
ocr = None  # Global variable to store the OCR model


@app.route('/')
def index():
    return send_from_directory('../React_Frontend/build', 'index.html')


@app.route('/annotated-images/<path:filename>',methods=['GET'])
def serve_annotated_image(filename):
    return send_from_directory(ANNOTATED_IMAGES_DIR, filename)


def get_ocr(lang):
    global ocr
    

    if ocr is None or getattr(ocr,'lang', None) != lang:
        # Create a new PaddleOCR instance with the specified language
        ocr = PaddleOCR(use_angle_cls=True, lang=lang)

    return ocr


@app.route('/upload-and-extract', methods=['POST'])
def upload_and_extract_text():
     global selected_language
     try:
        originalMap = request.files.getlist('original')
        reproducedMap = request.files.getlist('reproduced')
        annotated_img_urls=[]
        bouding_boxes_In=[]
        Extracted_texts=[]
        Extracted_texts_BB=[]
        matching_results = []
        selected_language = request.form.get('language', 'en')
        print("now the language support is",selected_language)
        ocr = get_ocr(selected_language)
        if not originalMap or not reproducedMap:
           return jsonify({"error": "No files Provided"}), 400
               
        for original_map, reproduced_map in zip(originalMap, reproducedMap):  

             print("========================================")
             print("Extraction Process Started") 
             print("========================================")
             try:
                orginal_result = process_extraction(ocr,original_map)
                reproduced_result = process_extraction(ocr,reproduced_map)
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
                "original_dimension":orginal_result['img_dimension'],
                "reproduced_dimension":reproduced_result['img_dimension']
            })
             Extracted_texts_BB.append({
                "original_list": orginal_result['BB_texts'],
                "reproduced_list":reproduced_result['BB_texts'],               
            })
             bouding_boxes_In.append({
                'Original_BB':orginal_result['BBs'],
                'Reproduced_BB':reproduced_result['BBs']
             })
             response_data = {
                    "Texts_BBS":Extracted_texts_BB
                }
              #print(response_data)
        
        original_element= Extracted_texts_BB[0]["original_list"]
        reproduced_element=Extracted_texts_BB[0]["reproduced_list"]
        #map_urls=annotated_img_urls
        orginal_url=annotated_img_urls[0]["original_img_url"]
        reproduced_url=annotated_img_urls[0]["reproduced_img_url"]
        #bounding boxes
        OG_BB=bouding_boxes_In[0]["Original_BB"]
        RP_BB=bouding_boxes_In[0]["Reproduced_BB"]
        # sent the them to the frontend
        print("og_text_length",len(original_element))
        print("RP_text_lenght",len(reproduced_element))
        org_dimension=Extracted_texts[0]['original_dimension']
        rep_dimesion=Extracted_texts[0]['reproduced_dimension']
        print(org_dimension,rep_dimesion)
        #print(response_data)
        matching_results = compare_text_elements(original_element, reproduced_element,org_dimension,rep_dimesion)
        #print("Annotated images",annotated_img_urls)       
        return jsonify({"matching_Results":matching_results,
                        "bounding_boxes":[OG_BB,RP_BB],
                        "annotated_images": [orginal_url,reproduced_url]}), 200
          
     except Exception as e:
         print("Error during processing:", e)
         return {
            "image_url": "NO/Empty URL",  # You might return a placeholder or empty URL here
            "extracted_text": [],
            "scores": [],
            "error": str(e) # Include the error message in the result
        }
                        
   
def process_extraction(ocr,image_file):
    BB_text=[]
    # Process the image, save and annotate it, and extract text as needed
    # Return the result as a dictionary with the image URL and extracted text
    
    image_path = 'uploads/' + image_file.filename
    print("Saving Image",image_path)
    try:
        image_file.save(image_path)
        print("Image saved successfully.")
        print("Processing image:", image_path)
        result = ocr.ocr(image_path,cls=True)
       
    except Exception as e:
        print("Error processing image:", e)
   
    # Extracting detected components
    boxes = [res[0] for res in result[0]]
    texts = [res[1][0] for res in result[0]]
    scores = [res[1][1] for res in result[0]]
    
    img = cv2.imread(image_path)
    image_dimensions = (img.shape[1], img.shape[0])
    for res in result[0]:
        BB=res[0] 
        text=res[1][0] #Texts
        score=res[1][1]
        BB_text.append((BB,text,score))
    
    # Annotate the image
    font_path = os.path.join('PaddleOCR', 'doc', 'fonts', 'latin.ttf')
    img = cv2.imread(image_path)
    #img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
 
    annotated = draw_ocr(img, boxes, font_path=font_path)
    
    annotated_image_path = os.path.join(ANNOTATED_IMAGES_DIR, image_file.filename)
    cv2.imwrite(annotated_image_path, annotated)
    

    return {
        "image_url": annotated_image_path,
        "extracted_text": texts,
        "scores": scores,
        "BBs":boxes,
        "BB_texts":BB_text,
        "img_dimension":image_dimensions
    }
 

def calculate_bounding_box_overlap(box1, box2,Odimension,Rdimension):
    # Calculate the coordinates of the intersection rectangle
    x1_1, y1_1 = box1[0]
    x2_1, y2_1 = box1[2]
    #print("orignal",x1_1,y1_1,x2_1,y2_1)
    x1_2, y1_2 = box2[0]
    x2_2, y2_2 = box2[2]
     #Coordinate Normalization
    x1_1_N=x1_1/Odimension[0]
    y1_1_N=y1_1/Odimension[1]
    x2_1_N=x2_1/Odimension[0]
    y2_1_N=y2_1/Odimension[1]
    
    x1_2_N=x1_2/Rdimension[0]
    y1_2_N=y1_2/Rdimension[1]
    x2_2_N=x2_2/Rdimension[0]
    y2_2_N=y2_2/Rdimension[1]
    
    #print("reproduced",x1_2,y1_2,x2_2,y2_2)
    # Calculate the coordinates of the intersection rectangle
    x1_intersection = max(x1_1_N, x1_2_N)
    x2_intersection = min(x2_1_N, x2_2_N)
    width_intersection = max(0, x2_intersection - x1_intersection)
   
    
    
    y1_intersection = max(y1_1_N, y1_2_N)
    y2_intersection = min(y2_1_N, y2_2_N)
    height_intersection = max(0, y2_intersection - y1_intersection)
    # Calculate the width and height of the intersection rectangle
    #print("H",height_intersection)
    if width_intersection > 0 and height_intersection > 0:
        # Calculate the area of the intersection rectangle
      intersection_area = width_intersection * height_intersection

        # Calculate the areas of each bounding box
      area1 = (x2_1_N - x1_1_N) * (y2_1_N - y1_1_N)
      area2 = (x2_2_N - x1_2_N) * (y2_2_N - y1_2_N)

        # Calculate the Union (area of box1 + area of box2 - intersection area)
      union = area1 + area2 - intersection_area

      #print("Overlap Ratio:", overlap_ratio)
        # Calculate the IoU (intersection over union)
      overlap_ratio = intersection_area / union
    else:
        # If there is no intersection, overlap ratio is 0
      overlap_ratio = 0.0

    return overlap_ratio

def is_numeric(token):
    # Use a regular expression to check for numeric patterns
    return re.match(r'^[+\-]?\d*\.?\d+$', token) is not None

def is_special(token):
    # Consider a token as special if it contains both numeric and alphabetic characters
    return any(char.isnumeric() for char in token) and any(char.isalpha() for char in token)


def calculate_text_similarity(str1, str2,originals,reproduceds):
    str1 = str1.strip()
    str2 = str2.strip()
    str1 =str1.lower()
    str2= str2.lower()
    #print(str1,str2)
    if str1==str2:
        
        similarity_score=fuzz.UWRatio(str1,str2,full_process=False)
    else:
        similarity_score=fuzz.UWRatio(str1,str2,full_process=False)
        similarity_score=similarity_score * (originals+reproduceds)/2

   # similarity_score=fuzz.token_set_ratio(str1,str2) 
   # average_similarity = max(similarity_score1,similarity_score)  

    return similarity_score

   

def calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio,distance_bb, text_weight=0.5, bounding_box_weight=0.2, bounding_bb_weight=0.3):
    overall_score = (text_weight * text_similarity_score) + (bounding_box_weight * bounding_box_overlap_ratio) - (distance_bb * bounding_bb_weight)
    return overall_score

def compare_text_elements(original_elements, reproduced_elements,original_dimesnions, reproduced_dimensions):
    matching_results = []
    try:
        
        for original_bb, original_text, original_score in original_elements:
            best_match = None
            best_score = 25
            similarity_score=[]
            match_status="Not Matched"
            #reproduced_texts = []
            #bad_match = (original_text, "", 0, 0, 0, "Not Matched!")
            for reproduced_bb, reproduced_text ,reproduced_score in reproduced_elements:
              
                text_similarity_score = calculate_text_similarity(original_text, reproduced_text,original_score,reproduced_score)
                similarity_score.append(text_similarity_score)
                #text_similarity_score = max(similarity_score)
                
                bounding_box_overlap_ratio = calculate_bounding_box_overlap(original_bb, reproduced_bb,original_dimesnions,reproduced_dimensions)
                distance_bb=calculate_distance_between_bounding_boxes(original_bb,reproduced_bb,original_dimesnions,reproduced_dimensions)
               # print(original_text,reproduced_text,text_similarity_score)
               #  
                final_score = calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio,distance_bb)
                
                
               # print(bounding_box_overlap_ratio,text_similarity_score)
                if  max(similarity_score) >=75 and distance_bb <= 0.05 and final_score >= best_score:
                    match_status="Matched!" 
                    best_match = (
                        original_text, 
                        reproduced_text,
                        max(similarity_score), 
                        bounding_box_overlap_ratio,
                        final_score,
                        match_status,
                        distance_bb,
                        original_bb,
                        reproduced_bb,
                        original_score,
                        reproduced_score)
                    best_score = final_score  
                    
            max_similarity_score = max(similarity_score)
           # print(f"Max similarity score for '{original_text}' '{reproduced_text}': {max_similarity_score}")
                        
                #if bounding_box_overlap_ratio > 0 and text_similarity_score >=30:
                 #   match_status="Perfectly Matched!"      
                    #print(best_match)
                #else:
                #reproduced_texts=reproduced_text
                #for i in reproduced_texts:
                    
                #reproduced_texts.append(reproduced_text)
                    #match_status="Not matched!"
                    #bad_match=(original_text, reproduced_text,text_similarity_score, bounding_box_overlap_ratio, final_score,match_status)
                    #match_status ="Matched" if best_match else "Not Matched"
                    #last_reproduced_text=best_match[1] if best_match and best_match[1] else reproduced_text
                    #print(bad_match)     
                                
            if best_match :
                 matching_results.append({
                        "Original Text": best_match[0],
                        "Reproduced Text": best_match[1],
                        "Text Similarity Score":best_match[2] ,
                        "Bounding Box Overlap Ratio": best_match[3] ,
                        "Final_score":  best_match[4] ,
                        "Match Status": best_match[5],
                        "Distance_bb":best_match[6],
                        "OG BB" :best_match[7],
                        "RP BB":best_match[8] ,
                        "OG Score":best_match[9],
                        "RP Score":best_match[10]
                        })
            else:
                matching_results.append(
                    {
                        "Original Text": original_text,
                        "OG BB" :original_bb,
                        "Reproduced Text": "No Similar text Found",  # Include all reproduced texts
                       
                        "Text Similarity Score": 0,
                        "Bounding Box Overlap Ratio": 0,
                        "Final_score": 0,
                         "Distance_bb":0,
                        "Match Status": match_status,
                    }
                )
                     
        return matching_results
    except Exception as e:
         print(f"An error occurred: {e}")


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
   app.run(debug=True, host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))


