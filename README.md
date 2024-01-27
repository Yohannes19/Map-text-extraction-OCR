# Map Reproducibility Assessment Tool

## Overview
The Map Reproducibility Assessment Tool is a web-based application designed to facilitate the assessment of map reproducibility in geoscience publications. It allows users to upload original and reproduced map images, extract textual elements using OCR (Optical Character Recognition) technology, and compare the extracted texts to evaluate map accuracy.

## Features
- Upload original and reproduced map images
- Extract textual elements using OCR
- Calculate text similarity, bounding box overlap ratio, and distance between bounding boxes
- Visualize annotated images with bounding boxes
- Interactive table for exploring assessment results

## Technologies Used
- **Backend:** Flask (Python)
- **Frontend:** React.js
- **OCR Engine:** PaddleOCR
- **Additional Libraries:** NumPy, fuzzywuzzy, OpenCV

## Installation and Setup
1. Clone this repository: `git clone <repository_url>`
2. Navigate to the `Flask_backend` directory and install dependencies: `pip install -r requirements.txt`
3. Run the Flask server: `python app.py`
4. Navigate to the `React_Frontend` directory and install dependencies: `npm install`
5. Run the React frontend: `npm start`

## Usage
1. Upload original and reproduced map images.
2. Select preferred languages for text extraction.
3. Click the "Upload and Extract" button to initiate text extraction and comparison.
4. Explore assessment results in the interactive table.
5. Click on a row in the table to highlight corresponding text elements on the annotated images.

## Contributors
- [Your Name](https://github.com/yohannes19)


## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
- Special thanks to [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) for providing the OCR engine.
- Built with inspiration from the field of geoscience and reproducible research.

## Feedback and Contributions
Feedback, bug reports, and contributions are welcome! Please feel free to open an issue or submit a pull request.

