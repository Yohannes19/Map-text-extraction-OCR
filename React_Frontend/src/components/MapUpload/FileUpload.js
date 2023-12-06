import React, { useState ,useEffect,useRef} from "react";
import { useDropzone } from "react-dropzone";
import Container from 'react-bootstrap/Container';
import {Button, Modal,Card } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import "./FileUpload.css";
import Spinner from "react-bootstrap/Spinner";
import { FaUpload } from "react-icons/fa6"; 
import axios from 'axios';

import ComparisonSection from "./ComaprsionSection";
import { useNavigate ,useHistory} from "react-router-dom";

function FileUpload() {
  const [original, setOriginalMap] = useState([]);
  const [reproduced, setReproducedMap] = useState([]);
  const navigate=useNavigate()

  //State for message alert
  const [show, setShow] = useState(true);
  const [message,setMessage]=useState("");
  const [loading, setLoading] = useState(false);
  //Match Results
  const [results, setResults] = useState([]);
  //image_urls
  const[imgURLs,setImgURLs]=useState([]);
  //Results checking
  const [resultsReceived, setResultsReceived] = useState(false);
  //Text selection
  const [selectedText, setSelectedText] = useState(null);
  const [selectedOGBB, setSelectedOGBBS] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState(" ");
  
  
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
      setReproducedMap(acceptedFiles);
    },
    multiple:true,
  });

  const handleUploadClick = async () => {
    setShow(true);
    try {
      // Check if there are uploaded files
      if (Array.isArray(original) && original.length > 0 && Array.isArray(reproduced) && reproduced.length > 0) {
       
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
            const annotated_imgs=response.data.annotated_images;
            //const bounding_boxes=response.data.bounding_boxes;  
            console.log(annotated_imgs)
            //console.log("bounding",comparsion_lists)
            //setBoundingBoxes(bounding_boxes)
          

            setResultsReceived(true);
            setImgURLs(annotated_imgs);
            setResults(comparsion_lists);
            sessionStorage.setItem('comparisonResults', JSON.stringify({ results: comparsion_lists, imgURLs: annotated_imgs }));

            console.log("Navigating with state:", { resultsReceived: true, imgURLs: annotated_imgs, results: comparsion_lists });
            navigate("/comparison", { state: { resultsReceived: true, imgURLs: annotated_imgs, results: comparsion_lists } })
          } else {
            const serverInfo = "The server response is invalid. Please try again.";
            setMessage(serverInfo);
            setLoading(false);
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
  
  
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [message]);
  
return (
  <>
  <Container fluid className="container-1"> 
     
      <Row>
         <Row className="mt-0">
      <Col>
    { show && message  && (<Alert variant="danger" onClose={() => setShow(false)} dismissible>
    <Alert.Heading>Error!</Alert.Heading>
      <p>{message}</p> 
      </Alert>)}
      </Col>
    </Row>
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
       <div className="overlay">
       <Spinner animation="border" role="status">
         <span className="sr-only">Loading...</span>
       </Spinner>
       <p style={{ marginLeft: '10px' }}> Please wait...</p>
     </div>
      
        )}
        </Col>
      </Row>
      <Col className="col-4">
        <Card style={{ width: '94rem',height:'18rem', marginTop:'10rem'}}>
          <Card.Header>How to use the MC-tool?</Card.Header>
          <Card.Body>
          
          1. Click on the "dropzone" to select the map image .<br/>
          2. The System will check for the size of both images and ask the confirmation for resizing.<br/>
          3. Click the "Upload and Extract" button to extract  texts from  the map.
          </Card.Body>
        
        </Card>
      
      </Col>
      
      </Row>
     
      </Container>  
</>
  );
}
export default FileUpload;
