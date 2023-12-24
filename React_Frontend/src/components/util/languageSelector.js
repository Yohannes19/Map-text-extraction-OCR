// LanguageSelector.jsx
import { useState } from "react";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import FlagIcon from './flagIcon.js';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const [countries] = useState([
    { code: 'us', N : 'en',title: 'English' },
    { code: 'cn', N:'ch', title: 'Chinese' },
    { code: 'de', N:'german', title: 'German' },
    { code: 'fr', N:'fr', title: 'French' },
  
  ]);

  const [toggleContents, setToggleContents] = useState('Language');
  const [selectedCountry, setSelectedCountry] = useState();

  const handleLanguageChange = (eventKey) => {
    const { code, title ,N } = countries.find(({ code }) => eventKey === code);

    setSelectedCountry(eventKey);
    setToggleContents(
      <>
        <FlagIcon code={code} /> {title}
      </>
    );

    // Call onLanguageChange with the selected country code
    onLanguageChange(N);
  };

  return (
    <div className="App">
      <Form>
        <Dropdown
          onSelect={handleLanguageChange}
        >
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-flags"
            className="text-left"
            style={{ width: 120 }}
          >
            {toggleContents}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {countries.map(({ code, title }) => (
              <Dropdown.Item key={code} eventKey={code}>
                <FlagIcon code={code} /> {title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form>
    </div>
  );
};

export default LanguageSelector;
