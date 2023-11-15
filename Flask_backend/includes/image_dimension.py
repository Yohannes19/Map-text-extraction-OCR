import cv2,os

temp_dir = "temp_images"
os.makedirs(temp_dir, exist_ok=True)
def get_image_dimensions(original_map,reproduced_map):
        
    original_path = os.path.join(temp_dir, original_map.filename)
    reproduced_path = os.path.join(temp_dir, reproduced_map.filename)

    original_map.save(original_path)
    reproduced_map.save(reproduced_path)
    OD = cv2.imread(original_path)
    original_dimensions = OD.shape[:2]
    RD = cv2.imread(reproduced_path)
    reproduced_dimensions = RD.shape[:2]
    
    return original_dimensions,reproduced_dimensions
    
  
    

    