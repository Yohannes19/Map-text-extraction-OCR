import React ,{useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import Result from "./ResultModal";
import ImageDisplay from "./annotated_image_display";
import NoData from "../util/Nodata";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ReturnHomeButton from "./return";
const ComparisonSection = () => {
  // Implement your Comparison section UI using the props provided
  const location = useLocation();
  const { state } = location;
  const { results:intialResults, resultsReceived:intialResultRecieved, imgURLs:intialImgURLs } = state || {};
  const [selectedText, setSelectedText] = useState(null);
  const [selectedOGBB, setSelectedOGBBS] = useState(null);
  const [results, setResults] = useState(null);
  const [imgURLs, setImgURLs] = useState(null);
  const [resultsReceived, setResultsReceived] = useState(false);

  useEffect(() => {
    console.log('ComparisonSection component mounted');
    console.log('resultsReceived:', resultsReceived);
    console.log('results:', results);
    console.log('imgURLs:', imgURLs);
  }, [resultsReceived, results, imgURLs]);
  useEffect(() => {
    console.log('ComparisonSection component mounted');
    const storedResults = sessionStorage.getItem('comparisonResults');
    if (storedResults) {
      const { results: storedResultsData, imgURLs: storedImgURLs } = JSON.parse(storedResults);
      setResults(storedResultsData);
      setImgURLs(storedImgURLs);
      setResultsReceived(true);
    }
  }, []);
 // Render the component only if resultsReceived is true
 if (!resultsReceived || !results || !imgURLs) {
  // or any placeholder or loading component
  return <NoData />;
}

const onTextClick = (text, OGBBS) => {
  if(OGBBS){
   setSelectedText(text);
   setSelectedOGBBS(OGBBS)
  }
  else{
   alert("BB not found")
  }
   console.log("Selected Text:", text);
   console.log("SelectedOGBBS",OGBBS);
   

 };
  
  return (
 
    <>
    
    <Row>     
        <Col sm={5}>
         <Card>
          <Card.Body>
          <Card.Header>Reproducibility Assessment Results</Card.Header>
          <Result results={results} onTextClick={onTextClick} /> 
      
          </Card.Body>
          </Card>
          </Col>
          <Col sm={7}>
          <Card>
            <Card.Body>
            <Card.Header>Annotated Maps</Card.Header>
            {resultsReceived ? (
                <ImageDisplay imgURLs={imgURLs} selectedText={selectedText} selectedOGBB={selectedOGBB} onTextClick={onTextClick} />
              ) : (
                <p>No images available.</p>
              )}
              </Card.Body>
          </Card>
        </Col> 
        
        </Row>
        <Row className="mt-2">
         
        <Row >
         
        </Row>
       
        </Row>
        <Row >
          <Col sm={4}>
          <Card>
            <Card.Body>
           
            
            </Card.Body>
          </Card>  
        </Col>
        </Row>
        
    </>
   
  );
};

export default ComparisonSection;
