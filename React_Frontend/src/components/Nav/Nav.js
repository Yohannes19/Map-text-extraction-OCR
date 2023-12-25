import React ,{ useEffect,useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbarapp = ({ links }) => {
 //const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
        <i className='fas fa-map'></i>
          {' '}
          mapRepro Assess
        </Link>

        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ms-auto'>
            {links.map((link) => (
              <li key={link.path} className={`nav-item ${activeLink === link.path ? 'active' : ''}`}>
                <Link className='nav-link' to={link.path} target={link.name === 'PaddleOCR' ? '_blank' : ''}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbarapp;
