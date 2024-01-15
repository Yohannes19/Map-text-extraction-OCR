import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Button, Pagination,OverlayTrigger, Tooltip } from 'react-bootstrap';
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
  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">
      {text}
    </Tooltip>
  );
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
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Text extracted from the original map")}>
        <th>Original Text</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Text extracted from the reproduced map")}>
        <th>Reproduced Text</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Fuzzy string matching technique (theFuzz) score between original and reproduced text")}>
        <th>Text Similarity Score</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Overlap ratio between bounding boxes of original and reproduced text")}>
        <th>BB Overlap Ratio</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Distance between bounding boxes of original and reproduced text")}>
        <th>Distance b/n Bounding Boxes</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Final score calculated using text similarity score(+), bounding boxes overlap ratio(+), and distance between bounding boxes(-)")}>
        <th>Final Score</th>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={renderTooltip("Matched if : Text Similarity > 75, BB Overlap Ratio > 0, Distance between Bounding Boxes > 0.05 pixels, and Final Score >= 25.  Otherwise, The texts are mismatched")}>
        <th>Match Status</th>
      </OverlayTrigger>
    </tr>
            </thead>
            <tbody>
              {currentMatchingResults.map((result, index) => (
                <tr key={index}
                 style={{cursor:"pointer"}}
                  onClick={() => onTextClick(
                  result['Original Text'],
                  result['Reproduced Text'],
                  result['OG BB'],
                  result['RP BB'],
                  result['OG Score'],
                  result['RP Score'])} >
                  <td >{result['Original Text']} </td>
                  <td >{result['Reproduced Text']} </td>
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
