import React from 'react';
import './support.css'; // Include your support component styling

const SupportComponent = () => {
  return (
    <div className="support-container">
      

      {/* Frequently Asked Questions (FAQs) */}
      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-item">
          <p className="question">How do I get started with the system?</p>
          <p className="answer">To get started, follow these steps...</p>
        </div>
        {/* Add more FAQ items as needed */}
      </section>

      {/* User Guides or Tutorials */}
      <section className="guides-section">
        <h3>User Guides and Tutorials</h3>
        <div className="guide-item">
          <p className="guide-title">User Guide: [Title]</p>
          <p className="guide-description">A step-by-step guide on how to [do something]...</p>
          {/* Add more guides as needed */}
        </div>
      </section>

      {/* Troubleshooting and Known Issues */}
      <section className="troubleshooting-section">
        <h3>Troubleshooting and Known Issues</h3>
        <div className="issue-item">
          <p className="issue-title">Issue: [Title]</p>
          <p className="issue-description">If you encounter [issue], follow these steps to troubleshoot...</p>
          {/* Add more known issues as needed */}
        </div>
      </section>

      {/* Contact Support */}
      <section className="contact-section">
        <h3>Contact Support</h3>
        <p>
          If you need further assistance, please contact our support team at{' '}
          <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </section>
    </div>
  );
};

export default SupportComponent;
