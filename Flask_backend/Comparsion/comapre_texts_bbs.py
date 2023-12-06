from Comparsion.text_similarity import calculate_text_similarity
from Comparsion.bb_overlap import calculate_bounding_box_overlap
from Comparsion.overall_score import calculate_overall_score


def compare_text_elements(original_elements, reproduced_elements):
    matching_results = []
    
    for original_bb, original_text in original_elements:
        best_match = None
        best_score = 0

        for reproduced_bb, reproduced_text in reproduced_elements:
            text_similarity_score = calculate_text_similarity(original_text, reproduced_text)
            bounding_box_overlap_ratio = calculate_bounding_box_overlap(original_bb, reproduced_bb)
            final_score = calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio)
            
            if text_similarity_score >= 0.2 and bounding_box_overlap_ratio >= 0.1 and final_score > best_score:
                 best_match = (original_text, reproduced_text, text_similarity_score, bounding_box_overlap_ratio, final_score)

                 best_score = final_score
          
            
        if best_match:
            matching_results.append({
                "Original Text": best_match[0],
                "Reproduced Text": best_match[1],
                "Text Similarity Score": best_match[2],
                "Bounding Box Overlap Ratio": best_match[3],
                "Final_score": best_match[4],
                "Match Status": "Match"
            })
        else:
            matching_results.append({
                "Original Text": original_text ,
                "Reproduced Text": None,  # You can set this to a default value or handle it based on your use case
                "Text Similarity Score": None,
                "Bounding Box Overlap Ratio": None,
                "Final_score": None,
                "Match Status": "No Match" 
            })
              
    #print(matching_results)
    return matching_results
