from thefuzz import fuzz
import re

def dynamic_string_comparison(str1, str2, case_sensitive=False):
    str1 = str1.strip()
    str2 = str2.strip()

    # Check if case sensitivity is required
    if not case_sensitive:
        str1 = str1.lower()
        str2 = str2.lower()

    # String-Only Comparison
    string_similarity = fuzz.ratio(str1, str2)

    # Numeric and String Mix Comparison
    numeric_similarity = 0
    if any(char.isdigit() for char in str1) and any(char.isdigit() for char in str2):
        numeric_str1 = extract_numeric_part(str1)
        numeric_str2 = extract_numeric_part(str2)

        # Compare normalized numeric values
        numeric_similarity = fuzz.ratio(numeric_str1, numeric_str2)

    # Numbers-Only Comparison
    numeric_str1_only = ''.join(c for c in str1 if c.isdigit())
    numeric_str2_only = ''.join(c for c in str2 if c.isdigit())

    # Calculate weighted average
    if numeric_similarity > 0:
        total_similarity = (string_similarity + numeric_similarity) / 2
    else:
        total_similarity = string_similarity

    return total_similarity

def extract_numeric_part(s):
    # Extract numeric parts from the string using regular expression
    numeric_parts = re.findall(r'\d+', s)
    return ''.join(numeric_parts)