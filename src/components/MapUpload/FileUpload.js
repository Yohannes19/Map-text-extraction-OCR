import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css";
import { FaUpload } from "react-icons/fa6"; 


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

  const handleUploadClick = () => {
    // Implement your upload logic here for leftFiles and rightFiles
    console.log("Uploading leftFiles:", leftFiles);
    console.log("Uploading rightFiles:", rightFiles);
  };

  return (
      <div > 
      <div className="upload-section">
        <div {...getLeftRootProps()} className="dropzone">
          <input {...getLeftInputProps()} />
          <FaUpload className="upload-icon" />
          <p>Drop Original Map </p>
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
          <p>Drop Original Map</p>
        </div>
        <div className="file-previews">
          {rightFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
          ))}
        </div>
      </div>
      <button className="upload-button" onClick={handleUploadClick}>
        Upload Files
      </button>
    </div>
  );
}

export default FileUpload;
