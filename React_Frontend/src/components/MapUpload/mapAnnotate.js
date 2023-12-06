import React, { useRef, useEffect,useState } from 'react';
import "./mapDisplay.css"
const AnnotatedImage = ({ imgURLs, selectedOGBB }) => {
  const canvasRefs = [useRef(null), useRef(null)];
  const x1Ref = useRef(0);
  const y1Ref = useRef(0);
  const x2Ref = useRef(0);
  const y2Ref = useRef(0);
  const imageRefs = [useRef(null),useRef(null)];
  
 const canvasDimensionsFirstImage=useRef({});
  useEffect(() => {
    const loadImages = async () => {
      try {
      for (let index = 0; index < imgURLs.length; index++) {
        const canvas = canvasRefs[index].current;
        const ctx = canvas.getContext('2d');
        canvas.width=400;
        canvas.height=400;
        
        const image = new Image();
        image.src = `http://localhost:5000/${imgURLs[index]}`;
        await new Promise((resolve) => (image.onload = resolve));

         imageRefs[index].current = image;

        if (selectedOGBB && Array.isArray(selectedOGBB[index])) {
          [x1Ref.current, y1Ref.current] = selectedOGBB[0] ;
          [x2Ref.current, y2Ref.current] = selectedOGBB[2] ;
          console.log("Men yeka",selectedOGBB[0])
          console.log(`Selected OGBB for Image ${index + 1}:`, selectedOGBB);

        }
       

        const { naturalWidth, naturalHeight } = image;
         console.log("H",naturalHeight)
         console.log("W",naturalWidth)
        // Set a fixed size for the canvas
        //const aspectRatio=naturalWidth/naturalHeight;
        //console.log("aspect ratio",aspectRatio)
        //const canvasWidth=450
        // const canvasWidth =  Math.min(naturalWidth, maxCanvasWidth);
        //const canvasHeight = (canvasWidth/naturalWidth)  * naturalHeight
        //const canvasWidth=naturalWidth
        //const canvasHeight=naturalHeight
        //const canvasHeight = canvasWidth / aspectRatio;
        let w=canvas.width;
        let aspect=naturalWidth/naturalHeight
        let h=w/aspect
        canvas.width = w;
        canvas.height = h;

        let scaleX = canvas.width / naturalWidth;
        let scaleY = canvas.height / naturalHeight;

        if (index === 0){
          canvasDimensionsFirstImage.current = {
            width: canvas.width,
            height: canvas.height,
            scaleX,
            scaleY,
          };
        }
        else {
          scaleX = canvasDimensionsFirstImage.current.scaleX;
          scaleY = canvasDimensionsFirstImage.current.scaleY;
        }
        console.log("Scalling x and y",scaleX,scaleY)

        const scaledX1 = x1Ref.current * scaleX;
        const scaledY1 = y1Ref.current * scaleY;
        const scaledX2 = x2Ref.current * scaleX;
        const scaledY2 = y2Ref.current * scaleY;
        
        
        console.log("Rescaled Coordinates",scaledX1,scaledY1,scaledX2,scaledY2)
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
          
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
        
        
      }
    } catch (error) {
      console.error('Error loading images:', error);
      //setError('Error loading images. Please try again.');
    } finally {
      //setLoading(false);
      console.error("e")
    }
    };

    loadImages();
  }, [imgURLs,x1Ref, y1Ref, x2Ref, y2Ref,selectedOGBB, canvasRefs]);

 

  
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
    <button className="primary">Refresh the drawing</button>
  </div>
  );
};

export default AnnotatedImage;
