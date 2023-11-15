from text_similarity import calculate_text_similarity
from bb_overlap import calculate_bounding_box_overlap
from overall_score import calculate_overall_score


def compare_text_elements(original_elements, reproduced_elements):
    matching_results = []
    
    for original_bb, original_text in original_elements:
            best_match = None
            best_score = 0

            for reproduced_bb, reproduced_text in reproduced_elements:
                text_similarity_score = calculate_text_similarity(original_text, reproduced_text)
                bounding_box_overlap_ratio = calculate_bounding_box_overlap(original_bb, reproduced_bb)
                final_score = calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio)
                    
                if text_similarity_score >= 0 and bounding_box_overlap_ratio >= 0.1 :
                    best_match = (original_text, reproduced_text, text_similarity_score, bounding_box_overlap_ratio, final_score)
                    best_score = final_score

            if best_match:
                matching_results.append({
                    "Original Text": best_match[0] ,
                    "Reproduced Text": best_match[1] ,
                    "Text Similarity Score": best_match[2] ,
                    "Bounding Box Overlap Ratio": best_match[3] ,
                    "Final_score": best_match[4] ,
                    "Match Status": "Match" 
                })
            
           # print(matching_results)
            else:
              matching_results.append({
                    "Original Text": original_text  if original_text else "No OG Text" ,
                    "Reproduced Text":  reproduced_text,
                    "Text Similarity Score": text_similarity_score,
                    "Bounding Box Overlap Ratio": bounding_box_overlap_ratio,
                    "Final_score": final_score,
                    "Match Status": "No Match" 
                })
        
        
    return matching_results