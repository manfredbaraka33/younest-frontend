import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Developer = () => {
  return (
    <div className="container mt-5">
      <h4>Contact Developer</h4>
      <div className="contact-info">
        <div className="contact-item">
          <h5>
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Email
          </h5>
          <p>
            <a href="mailto:manfredbaraka33@gmail.com">
              manfredbaraka33@gmail.com
            </a>
          </p>
        </div>
        <div className="contact-item">
          <h5>
            <FontAwesomeIcon icon={faLinkedin} className="me-2" />
            LinkedIn
          </h5>
          <p>
            <a 
              href="https://www.linkedin.com/in/manfredbaraka/" 
              target="_blank" 
              rel="noopener noreferrer">
              manfredbaraka
            </a>
          </p>
        </div>
        <div className="contact-item">
          <h5>
            <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
            WhatsApp
          </h5>
          <p>
            <a 
              href="https://wa.me/255712750468" 
              target="_blank" 
              rel="noopener noreferrer">
              +255712750468
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Developer;
