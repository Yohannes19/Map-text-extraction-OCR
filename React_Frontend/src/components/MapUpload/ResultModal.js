import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Button, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { Cursor, Download } from "react-bootstrap-icons";
import './result.css'

function Result({ results,onTextClick }) {
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
    <div>
    
      {results ? (
        <div>
          <Table striped bordered hover responsive className="custom-table">
            <thead>
              <tr>
                <th>Original Text</th>
              
                <th>Reproduced Text</th>
               
                <th>Text Similarity Score</th>
                <th>BB Overlap ratio</th>
                <th>Distance b/n Bounding boxes</th>
                <th>Final Score</th>
                <th>Match Status</th>
              </tr>
            </thead>
            <tbody>
              {currentMatchingResults.map((result, index) => (
                <tr key={index}  >
                  <td style={{cursor:"pointer"}} onClick={() => onTextClick(result['Original Text'],result['OG BB'])}>{result['Original Text']} </td>
                  <td style={{cursor:"pointer"}} onClick={() => onTextClick(result['Reproduced Text'],result['RP BB'])}>{result['Reproduced Text']} </td>
                  <td>{ Math.round(result['Text Similarity Score'],4)}</td>
                  <td>{ (Math.round(result['Bounding Box Overlap Ratio'] * 10000) / 10000).toFixed(4)}</td>
                  <td>{ (Math.round(result['Distance_bb']*10000) / 10000).toFixed(4)}</td>
                  <td>{ Math.round(result['Final_score'],4)}</td>
                  <td>{ result['Match Status']}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination">
            <Pagination>

              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
               <Pagination.Item disabled>
                <p className="page-number">Page {currentPage}</p>
              </Pagination.Item>  
              <Pagination.Next
                disabled={endIndex >= results.length}
                onClick={() => handlePageChange(currentPage + 1)}
              />
               
            </Pagination>
          </div>

          <Button bsStyle="success" bsSize="small"  onClick={handleDownloadClick}>
          <Download style={{ marginRight: '5px' }} />
                Download Excel 
          </Button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Result;
