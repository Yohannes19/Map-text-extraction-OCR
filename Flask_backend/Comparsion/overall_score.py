def calculate_overall_score(text_similarity_score, bounding_box_overlap_ratio, text_weight=0.7, bounding_box_weight=0.3):
    overall_score = (text_weight * text_similarity_score) + (bounding_box_weight * bounding_box_overlap_ratio)
    return overall_score