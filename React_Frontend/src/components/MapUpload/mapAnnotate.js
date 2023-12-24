import React, { useRef, useEffect ,useState} from 'react';
import "./mapDisplay.css";
import { Alert } from 'react-bootstrap';

const AnnotatedImage = ({ imgURLs, selectedOGBB, selectedRPBB, selectedOGscore, selectedRPscore, onTextClick }) => {
 // console.log('Props in AnnotatedImage:', imgURLs, selectedOGBB, selectedRPBB, selectedOGscore, selectedRPscore);

  const canvasRefs = [useRef(null), useRef(null)];
  const [refresh, setRefresh] = useState(false);

  const drawBoundingBox = (ctx, x1, y1, x2, y2, scaleX, scaleY, color, score) => {
    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledY2 = y2 * scaleY;

    ctx.fillStyle = `rgba(${color === 'Green Box' ? '0, 255, 0' : '255, 0, 0'}, 0.3)`;
    ctx.fillRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);

    if(!score){
     window.confirm('No bounding box Found for Reproduced text, Continue to draw for originla only?')
     
    }
    else{
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign='left'
    ctx.lineWidth = 4;
    ctx.fillText(score.toFixed(2), scaledX1, scaledY1 - 5);
    }
  };

  useEffect(() => {
    const handleImageLoad = (index) => {
      try {
        const canvas = canvasRefs[index].current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = `http://localhost:5000/${imgURLs[index]}`;

        image.onload = () => {
       //   console.log('Image loaded successfully:', image.src);
          const { naturalWidth, naturalHeight } = image;
          const canvasWidth = 500;
          const canvasHeight = 800;
          
          // Calculate aspect ratio
          const aspectRatio = naturalWidth / naturalHeight;
         
          const widthScale = canvasWidth / naturalWidth ;
          const heightScale = canvasHeight / naturalHeight *aspectRatio;

// Choose the appropriate scaling factor to maintain aspect ratio
          const scale = Math.min(widthScale, heightScale);

          // Calculate scaled dimensions
          const scaledWidth = naturalWidth * scale;
          const scaledHeight = naturalHeight * scale;
          
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;


          const scaleX = canvas.width / naturalWidth;
          const scaleY = canvas.height / naturalHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const selectedOGBBs = selectedOGBB;
          const selectedRPBBs = selectedRPBB;

          if (selectedOGBBs && index === 0) {
            const [x1, y1] = selectedOGBBs[0];
            const [x2, y2] = selectedOGBBs[2];
            drawBoundingBox(ctx, x1, y1, x2, y2, scaleX, scaleY, 'Green Box', selectedOGscore);
          }

          if (selectedRPBBs && selectedRPBBs.length > 0 && index === 1) {
            const [rx1, ry1] = selectedRPBBs[0];
            const [rx2, ry2] = selectedRPBBs[2];
            drawBoundingBox(ctx, rx1, ry1, rx2, ry2, scaleX, scaleY, 'Red Box', selectedRPscore);
          }
          if (refresh) {
            // Reset state values to avoid redrawing boxes
            setRefresh(false);
          }
        };
      } catch (error) {
        console.error(`Error handling image for Image ${index + 1}:`, error);
      }
    };
  

    handleImageLoad(0);
    handleImageLoad(1);
  }, [imgURLs, selectedOGBB, selectedRPBB, selectedOGscore, selectedRPscore, canvasRefs]);
  const handleRefreshClick = () => {
    // Set the refresh state to true to trigger the image reload
    setRefresh(true);
  };
  return (
    <div className="image-container">
      <div className="canvas-wrapper">
        {canvasRefs.map((canvasRef, index) => (
          <div key={index}>
            <canvas ref={canvasRef} />
            <p>{index === 0 ? 'Original Map' : 'Reproduced Map'}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default AnnotatedImage;
