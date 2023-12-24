import React ,{useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import Result from "./ResultModal";
import ImageDi from "./annotated_image_display";
import AnnotatedImage from "./mapAnnotate";
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
  const [selectedOGText, setSelectedOGText] = useState(null);
  const [selectedRPText, setSelectedRPText] = useState(null);
  const [selectedOGBB, setSelectedOGBBS] = useState(null);
  const [selectedRPBB, setSelectedRPBBS] = useState(null);
  const [selectedOGscore,setSelectedOGScore]=useState(0);
  const [selectedRPscore,setSelectedRPScore]=useState(0);
  const [results, setResults] = useState(null);
  const [imgURLs, setImgURLs] = useState(null);
  const [resultsReceived, setResultsReceived] = useState(false);

  useEffect(() => {
    console.log('ComparisonSection component mounted');
    console.log('resultsReceived:', resultsReceived);
    //console.log('results:', results);
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

const onTextClick = (OGtext,RPtext, OGBBS,RPBBS,OGScore,RPScore) => {
   
  console.log("Selected Text:", OGtext);
   console.log("SelectedOGBBS",OGBBS);
   console.log("SelectedRGBBS",RPBBS);
   console.log("score OG",OGScore);
   console.log("Score RP",RPScore);
   console.log("Selected Rtext",RPtext);
if(OGBBS  ){
   setSelectedOGText(OGtext);
   setSelectedRPText(RPtext);
   setSelectedOGBBS(OGBBS)
   setSelectedRPBBS(RPBBS)
   setSelectedOGScore(OGScore)
   setSelectedRPScore(RPScore)
  }
  else {
    alert('PRoblem here')
  }
}
  
  
   
 
 console.log('SelectedOGBBS i', selectedOGBB);
 console.log('SelectedRGBBS i', selectedRPBB);
 console.log('Score OG i', selectedOGscore);
 console.log('Score RP i', selectedRPscore);
 console.log('Selected Rtext i', selectedRPText);

  return (
 
    <>
    
    <Row>     
        <Col lg={4}>
         
          <Card.Header>Reproducibility Assessment Results</Card.Header>
          <Result results={results} onTextClick={onTextClick} /> 
      
          
          </Col>
          <Col lg={8}>
          
            
         
                <AnnotatedImage imgURLs={imgURLs} 
                
                selectedOGBB={selectedOGBB}
                selectedRPBB ={selectedRPBB}
                selectedOGscore={selectedOGscore}
                selectedRPscore={selectedRPscore} 
                onTextClick={onTextClick} />
             
            
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
