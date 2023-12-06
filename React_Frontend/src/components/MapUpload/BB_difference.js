import React from 'react';
import './mapDisplay.css'; // Add your CSS file for styling

const ImageOverlay = ({ imgURLs, selectedText,onTextClick }) => {
  
  return (
    <div className="image-overlay-container">
      {imgURLs.map((url, index) => (
        <img
          key={index}
          className={`image-overlay ${index === 0 ? 'left' : 'right'}  ${selectedText === 'YourDesiredText' ? 'highlighted' : ''}fade-in `  }
          src={`http://localhost:5000/${url}`}
          alt={`Annotated Image ${index}`}
          onClick={() => onTextClick('Hello ')} 
        />
      ))}
    </div>
  );
};

export default ImageOverlay;
