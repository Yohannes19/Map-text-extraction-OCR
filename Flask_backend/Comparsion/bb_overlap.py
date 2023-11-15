from fuzzywuzzy import fuzz
def calculate_bounding_box_overlap(box1, box2):
    # Box format: (x, y, width, height)
    x1, y1, w1, h1 = box1
    x2, y2, w2, h2 = box2

    # Calculate the coordinates of the intersection rectangle
    x_intersection = max(x1, x2)
    y_intersection = max(y1, y2)
    x2_intersection = min(x1 + w1, x2 + w2)
    y2_intersection = min(y1 + h1, y2 + h2)

    # Calculate the area of the intersection rectangle
    intersection_area = max(0, x2_intersection - x_intersection) * max(0, y2_intersection - y_intersection)

    # Calculate the areas of each bounding box
    area1 = w1 * h1
    area2 = w2 * h2

    # Calculate the Union (area of box1 + area of box2 - intersection area)
    union = area1 + area2 - intersection_area

    # Calculate the IoU (intersection over union)
    overlap_ratio = intersection_area / union

    return overlap_ratio

