import React, { useState } from 'react';

const ImageComparison = ({ originalImage, reproducedImage, originalBoxes, reproducedBoxes, matchIndices }) => {
  const [alpha, setAlpha] = useState(0.5);

  const handleAlphaChange = (event) => {
    setAlpha(parseFloat(event.target.value));
  };

  return (
    <div>
      <div>
        <label>Adjust Transparency:</label>
        <input type="range" min="0" max="1" step="0.1" value={alpha} onChange={handleAlphaChange} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <img src={originalImage} alt="Original" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div style={{ flex: 1 }}>
          <img
            src={reproducedImage}
            alt="Reproduced"
            style={{ width: '100%', height: 'auto', opacity: alpha }}
          />
          <div>
            {reproducedBoxes.map((box, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  border: `2px solid ${matchIndices.includes(i) ? 'blue' : 'green'}`,
                  boxSizing: 'border-box',
                  ...boxToStyle(box),
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const boxToStyle = (box) => {
  // Convert bounding box coordinates to CSS style
  const [x, y, width, height] = box;
  return {
    left: x + 'px',
    top: y + 'px',
    width: width + 'px',
    height: height + 'px',
  };
};

export default ImageComparison;
