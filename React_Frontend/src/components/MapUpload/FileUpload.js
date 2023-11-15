import React, { useState ,useEffect} from "react";
import { useDropzone } from "react-dropzone";
import Container from 'react-bootstrap/Container';
import { Button, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import "./FileUpload.css";
import Spinner from "react-bootstrap/Spinner";
import { FaUpload } from "react-icons/fa6"; 
import axios from 'axios';
import ResultModal from "./ResultModal";

function FileUpload() {
  const [original, setOriginalMap] = useState([]);
  const [reproduced, setReproducedMap] = useState([]);

 
  //State for message alert
  const [show, setShow] = useState(true);
  const [message,setMessage]=useState("");
  //For Loading
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState([]);

  

  const { getRootProps: getLeftRootProps, getInputProps: getLeftInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      //validateImage(acceptedFiles[0],setOriginalMap);
      setOriginalMap(acceptedFiles)
    },
    multiple:true,
  });
  const { getRootProps: getRightRootProps, getInputProps: getRightInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      //validateImage(acceptedFiles[0],setReproducedMap);
      setReproducedMap(acceptedFiles);
    },
    multiple:true,
  });

  

  const handleUploadClick = async () => {
    setShow(true);
  
    try {
      // Check if there are uploaded files
      if (Array.isArray(original) && original.length > 0 && Array.isArray(reproduced) && reproduced.length > 0) {
        const originalImage = new Image();
        const reproducedImage = new Image();
        originalImage.src = URL.createObjectURL(original[0]);
        reproducedImage.src = URL.createObjectURL(reproduced[0]);
  
        // Create a function to load both images and handle errors
        const loadImages = (image1, image2) => new Promise((resolve, reject) => {
          image1.onload = () => resolve();
          image1.onerror = () => reject('Error loading original image');
          image2.onload = () => resolve();
          image2.onerror = () => reject('Error loading reproduced image');
        });
  
        // Use Promise.all to wait for both images to load
        await loadImages(originalImage, reproducedImage);
  
        if (
          originalImage.width === reproducedImage.width &&
          originalImage.height === reproducedImage.height 
        ) {
          // Images have the same dimensions, proceed
          const msg = "Dimensions are the same. You can proceed";
         // setMessage(msg);
          console.log("Dimensions are the same. You can proceed.");
          continueExtraction(); // Proceed with extraction
        } else {
          // Dimensions are different; ask the user if they want to resize
          const userResponse = window.confirm(
            "The dimensions of the original and reproduced images are different. Do you want to resize the images to match?"
          );
  
          if (userResponse) {
            // User wants to resize
            //const resizedOriginal = await resizeImage(original[0],originalImage);
            const resizedReproduced = await resizeImage(reproduced[0],originalImage);
            
            // Replace the original files with resized ones
            //original[0] = resizedOriginal;
            reproduced[0] = resizedReproduced;
  
            // Proceed with extraction
            continueExtraction();
          } else {
            const errMsg = "You chose not to resize the images. Extraction cannot proceed.";
            setMessage(errMsg);
          }
        }
      } else {
        const info = "Please select files to upload!";
        setMessage(info);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.log(error.response.data);
        setMessage(error.response.data.message);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  
  const continueExtraction = async () => {
    const formData = new FormData();
    original.forEach((file) => {
      formData.append("original", file);
    });
    reproduced.forEach((file) => {
      formData.append("reproduced", file);
    });
  
    setLoading(true);
  
    // Make a POST request to your Flask API endpoint
    const response = await axios.post("http://localhost:5000/upload-and-extract", formData, {
      headers: {
        "Content-Type": "multipart/form-data" // Set the correct content type for file uploads
      }
    });
  
    setLoading(false);
  
    if (response.data.message) {
      const message = response.data.message;
      setMessage(message);
    } else {
      if (response && response.data && Array.isArray(response.data.matching_Results)) {
        const comparsion_lists = response.data.matching_Results;
        console.log(comparsion_lists)
        setResults(comparsion_lists);
        setIsModalOpen(true);
      } else {
        const serverInfo = "The server response is invalid. Please try again.";
        setMessage(serverInfo);
        setLoading(false);
      }
    }
  };
  const resizeImage = async (file,referencedImage) => {
    // You can define the desired width and height for resizing
    const desiredWidth = referencedImage.width;
    const desiredHeight = referencedImage.height;
  
    const img = new Image();
    img.src = URL.createObjectURL(file);
  
    return new Promise(async (resolve) => {
      img.onload = async () => {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = desiredWidth;
        resizedCanvas.height = desiredHeight;
  
        const resizedContext = resizedCanvas.getContext('2d');
        resizedContext.drawImage(img, 0, 0, desiredWidth, desiredHeight);
  
        const resizedBlob = await new Promise((resolve) =>
          resizedCanvas.toBlob(resolve, 'image/jpeg', 0.9)
        );
  
        const resizedFile = new File([resizedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
  
        resolve(resizedFile);
      };
    });
  };  
return (
  <>
  <Container fluid> 
    <Row className=" mt-0">
      <Col>
    { show && message  && (<Alert variant="danger" onClose={() => setShow(false)} dismissible>
    <Alert.Heading>You got an error!</Alert.Heading>
      <p>{message}</p> 
      </Alert>)}
      </Col>
    </Row>
      <Row>
      <Col className='col-4 mt-2' >
            <div {...getLeftRootProps()} className="dropzone">
             <input {...getLeftInputProps()} />
             <FaUpload className="upload-icon" />
             <p>Drag 'n'Drop your Original Map </p>
             </div>
            <div className="file-previews">
              {original.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
              ))}
              </div>
      </Col>
      <Col className="col-5 mt-2" >
        <div {...getRightRootProps()} className="dropzone">
          <input {...getRightInputProps()} />
          <FaUpload className="upload-icon" />
          <p>Drag 'n'Drop your reproduced Map</p>
        </div>
        <div className="file-previews">
          {reproduced.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          ))}
        </div>    
      </Col>
      <Col className="col-2 mt-2">
      <button className="button-36" onClick={handleUploadClick}>
        Upload and Extract
      </button>
      </Col> 
      <Row>
        <Col className="col-2 mt-2 mr-2">
        { loading  &&(
       <Spinner animation="border" variant="primary">
       </Spinner>
        )}
        </Col>
      </Row>
      <Col className="col-2 mt-3">
      <ResultModal isOpen={isModalOpen} results={results} onRequestClose={() => setIsModalOpen(false)} />
      </Col>
      </Row>
      </Container>  
</>
  );
}
export default FileUpload;
