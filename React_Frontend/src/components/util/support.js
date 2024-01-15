import React from 'react';
import './support.css'; // Include your support component styling

const SupportComponent = () => {
  return (
    <div className="support-container">
      

      {/* Frequently Asked Questions (FAQs) */}
      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-item">
          <p className="question">1. How do I use the web app to assess map reproducibility?</p>
          <p className="answer">After uploading both the original and reproduced map images, and click the "Upload" button. The system will use Paddle OCR to extract text and calculate similarity, bounding box overlap ratio, and distance between bounding boxes. The results will be displayed in a table along with annotated map images.</p>
          <p className="question">2. What languages does the OCR engine support?</p>
          <p className="answer">The OCR engine (Paddle OCR) supports more than 80 languages, ensuring that map images in various languages can be accurately processed. however for the scope of this application, Englis is suppoted and integrated into the application</p>
          <p className="question">3. How are the similarity and overlap ratios calculated?</p>
          <p className="answer">The system utilizes advanced algorithms to calculate text similarity, bounding box overlap ratio, and distance between bounding boxes. These metrics provide a comprehensive assessment of map reproducibility.</p>
          <p className="question">4. Can I view the annotated map images with bounding boxes?</p>
          <p className="answer">Yes, the annotated map images with highlighted bounding boxes are displayed side by side for easy visual comparison.</p>
          <p className="question">5. How can I interpret the confidence scores?</p>
          <p className="answer">Confidence scores indicate the reliability of the OCR results. Clicking a row in the table highlights the corresponding text element on the map images, making it easy to understand the OCR's confidence in text extraction.</p>
          <p className="question">6. What file formats are supported for map image upload?</p>
          <p className="answer">The web app supports common raster map file formats, such as JPEG, PNG, WebP ,and BMP .</p>
          <p className="question">7. Is the web app suitable for assessing map reproducibility in scientific publications?</p>
          <p className="answer">Yes, the web app is designed to assess map reproducibility by comparing original and reproduced map images, making it a valuable tool for scientific research.</p>
          
        </div>
        {/* Add more FAQ items as needed */}
      </section>

      {/* User Guides or Tutorials */}
      

      {/* Troubleshooting and Known Issues */}
     

      {/* Contact Support */}
      <section className="contact-section">
        <h3>Contact Support</h3>
        <p>
          If you need further assistance, please contact our support team at{' '}
          <a href="mailto:support@example.com">joeabrha@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default SupportComponent;
