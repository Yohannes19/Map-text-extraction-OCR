import React, { useState ,useEffect} from "react";
import Modal from 'react-modal';
import Table from "react-bootstrap/Table";
import { Button, Pagination, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert'
import * as XLSX from 'xlsx';

Modal.setAppElement('#root'); // Set the root element for accessibility

function ResultModal({ isOpen, results, onRequestClose }) {
    
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const currentMatchingResults = results.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDownloadClick = () => {
    const data = results.map((result) => ({
      'Original Text': result['Original Text'],
      'Reproduced Text': result['Reproduced Text'],
      'Text Similarity Score': result['Text Similarity Score'],
      'Bounding Box Overlap Ratio': result['Bounding Box Overlap Ratio'],
      'Final Score': result['Final_score'],
      'Match Status': result['Match Status'],
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comparison Results');
    XLSX.writeFile(wb, 'comparison_results.xlsx');
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Result Modal">
      <h2>Total Comparsion Results</h2>
      {results ? (
        <div>
           <Table  striped bordered hover>
        <thead>
          <tr>
            <th>Original Text</th>
            <th>Reproduced Text</th>
            <th>Text Similarity Score</th>
            <th>Bounding Box Overlap Ratio</th>
            <th>Final Score</th>
            <th>Match Status</th>
          </tr>
        </thead>
        <tbody>
          {currentMatchingResults.map((result, index) => (
            <tr key={index}>
              <td>{result['Original Text']}</td>
              <td>{result['Reproduced Text']}</td>
              <td>{result['Text Similarity Score']}</td>
              <td>{result['Bounding Box Overlap Ratio']}</td>
              <td>{result['Final_score']}</td>
              <td>{result['Match Status']}</td> {/* This should work */}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination">
        <Pagination>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span><p style={{color:"blueviolet",fontSize:10,display:"inline"}}> Page {currentPage} </p></span>
              <Button
                disabled={endIndex >= results.length}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
              </Pagination>
            </div>
            
              <Button bsStyle="success" bsSize="small" onClick={handleDownloadClick}>
              Download
               </Button>
            

            
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default ResultModal;
