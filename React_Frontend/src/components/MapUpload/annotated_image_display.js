import React, { useState, useEffect } from 'react';
import "./mapDisplay.css"
import AnnotatedImage from './mapAnnotate';

export default function ImageDisplay({ imgURLs, selectedOGBB, selectedText, onTextClick }) {
  return (
    <div className="image-display">
      <div className="image-container">
      <AnnotatedImage imgURLs={imgURLs} selectedOGBB={selectedOGBB} selectedText={selectedText} onTextClick={onTextClick} />
        
      </div>
    </div>
  );
}
