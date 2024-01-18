''''from paddleocr import PaddleOCR,draw_ocr
from flask import Flask, abort, request
import os
from werkzeug.utils import secure_filename
ocr = PaddleOCR(use_angle_cls=True, lang='en')

UPLOAD_FOLDER = '/upload/'


def maptotext():
    file = request.files['image']
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    image = os.path.join(UPLOAD_FOLDER, filename)
    print(image)
    result = ocr.ocr(image, cls=True)
    txts = [line[1][0] for line in result]
    text = {'results': txts}
    return text
==================================
max_length=max(len(original_element),len(reproduced_element))
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
            
            if text_similarity_score >= 0.6 and bounding_box_overlap_ratio >= 0.2:
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
from thefuzz import fuzz               
str1 = "Heat alerts from media search, Mozambique (2016-2022)"
str2 = "heatalerts"

# Preprocessing
processed_str1 = str1.lower()  
processed_str2 = str2.lower()
print(f"Processed str1: {processed_str1}")
print(f"Processed str2: {processed_str2}")

# Fuzzy Ratio Calculation
fuzzy_ratio = fuzz.ratio(processed_str1, processed_str2)
print(f"Fuzzy Ratio: {fuzzy_ratio}")

# Length Checks
length_ratio = len(processed_str2) / len(processed_str1)
if length_ratio > 1.5:
    partial_ratio = fuzz.partial_ratio(processed_str1, processed_str2) * 0.9
    print(f"Partial Ratio (scaled): {partial_ratio}")
elif length_ratio > 8:
    partial_ratio = fuzz.partial_ratio(processed_str1, processed_str2) * 0.6
    print(f"Partial Ratio (scaled): {partial_ratio}")
else:
    print("No length check triggered")

# Step 4: Additional Ratio Calculations
partial_token_sort_ratio = fuzz.partial_token_sort_ratio(processed_str1, processed_str2) * 0.9
partial_token_set_ratio = fuzz.partial_token_set_ratio(processed_str1, processed_str2) * 0.9
token_sort_ratio = fuzz.token_sort_ratio(processed_str1, processed_str2) * 0.95
token_set_ratio = fuzz.token_set_ratio(processed_str1, processed_str2) * 0.95

print(f"Partial Token Sort Ratio (scaled): {partial_token_sort_ratio}")
print(f"Partial Token Set Ratio (scaled): {partial_token_set_ratio}")
print(f"Token Sort Ratio (scaled): {token_sort_ratio}")
print(f"Token Set Ratio (scaled): {token_set_ratio}")

# Step 5: Scaling
scaled_partial_ratio = partial_ratio * length_ratio
scaled_partial_token_sort_ratio = partial_token_sort_ratio * length_ratio
scaled_partial_token_set_ratio = partial_token_set_ratio * length_ratio

# Step 6: Final Result
final_score = max(
    fuzzy_ratio,
    scaled_partial_ratio,
    scaled_partial_token_sort_ratio,
    scaled_partial_token_set_ratio,
    token_sort_ratio,
    token_set_ratio
)

rounded_final_score = round(final_score)
print(f"Final Similarity Score: {rounded_final_score}")
