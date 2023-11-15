from fuzzywuzzy import fuzz 

def calculate_text_similarity(text1, text2):
    similarity_score = fuzz.ratio(text1, text2)
    return similarity_score
