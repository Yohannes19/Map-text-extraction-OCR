
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your Flask backend URL
});

// Function to upload an image and extract text
export const uploadAndExtractText = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-and-extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.extracted_text;
  } catch (error) {
    throw error;
  }
};

// Function to compare two texts (you can implement this later)
export const compareTexts = async (originalText, comparisonText) => {
  // Implement your text comparison logic here
};
