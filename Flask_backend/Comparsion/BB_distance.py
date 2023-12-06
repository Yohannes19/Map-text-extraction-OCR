import math

def calculate_distance_between_bounding_boxes(box1, box2, dimensions1, dimensions2):
    x1_1, y1_1 = box1[0]
    x2_1, y2_1 = box1[2]

    x1_2, y1_2 = box2[0]
    x2_2, y2_2 = box2[2]

    # Normalize coordinates based on image dimensions
    x1_1_normalized = x1_1 / dimensions1[0]
    y1_1_normalized = y1_1 / dimensions1[1]
    x2_1_normalized = x2_1 / dimensions1[0]
    y2_1_normalized = y2_1 / dimensions1[1]

    x1_2_normalized = x1_2 / dimensions2[0]
    y1_2_normalized = y1_2 / dimensions2[1]
    x2_2_normalized = x2_2 / dimensions2[0]
    y2_2_normalized = y2_2 / dimensions2[1]

    # Calculate the center coordinates of each bounding box
    center_x1 = (x1_1_normalized + x2_1_normalized) / 2
    center_y1 = (y1_1_normalized + y2_1_normalized) / 2

    center_x2 = (x1_2_normalized + x2_2_normalized) / 2
    center_y2 = (y1_2_normalized + y2_2_normalized) / 2

    # Calculate the Euclidean distance between the centers
    distance = ((center_x1 - center_x2) ** 2 + (center_y1 - center_y2) ** 2) ** 0.5

    return distance

