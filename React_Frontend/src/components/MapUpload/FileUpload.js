import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css";
import { FaUpload } from "react-icons/fa6"; 
import { uploadAndExtractText,compareTexts } from "../../http-common";

function FileUpload() {
  const [leftFiles, setLeftFiles] = useState([]);
  const [rightFiles, setRightFiles] = useState([]);
  const { getRootProps: getLeftRootProps, getInputProps: getLeftInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setLeftFiles(acceptedFiles);
    },
  });
  const { getRootProps: getRightRootProps, getInputProps: getRightInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setRightFiles(acceptedFiles);
    },
  });

const handleUploadClick = async () => {
  try {
    // Check if there are uploaded files
    if (leftFiles.length > 0 || rightFiles.length > 0) {
      const leftExtractedText = await uploadAndExtractText(leftFiles[0]);
      const rightExtractedText = await uploadAndExtractText(rightFiles[0]);

      // Now you have the extracted text, you can do whatever you want with it
      console.log('Extracted Text from Left Image:', leftExtractedText);
      console.log('Extracted Text from Right Image:', rightExtractedText);

      // You can also implement text comparison here if needed
     // const comparisonResult = await compareTexts(leftExtractedText, rightExtractedText);
    } else {
      console.error('No files to upload.');
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors, show messages, etc.
  }
};

   

  return (
      <div className="file-upload-container"> 
      <div className="title">
        Upload your Maps to check the reproucibility
      </div>
      <div className="upload-section">
        <div {...getLeftRootProps()} className="dropzone">
          <input {...getLeftInputProps()} />
          <FaUpload className="upload-icon" />
          <p>Drag 'n' Drop your Original Map </p>
        </div>
        <div className="file-previews">
          {leftFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          ))}
        </div>
      </div>
      <div className="upload-section">
        <div {...getRightRootProps()} className="dropzone">
          <input {...getRightInputProps()} />
          <FaUpload className="upload-icon" />
          <p>Drag 'n'Drop your Reproduced Map</p>
        </div>
        <div className="file-previews">
          {rightFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          ))}
        </div>
      </div>
      <button className="button-36" onClick={handleUploadClick}>
        Upload Files
      </button>
    </div>
  );
}

export default FileUpload;
