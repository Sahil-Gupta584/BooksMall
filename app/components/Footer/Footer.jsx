// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 RJ Commerce. All rights reserved.</p>
      <ul className="footer-links">
        <li><a href="#privacy">Privacy Policy</a></li>
        <li><a href="#terms">Terms & Conditions</a></li>
        <li><a href="#faq">Frequently Asked Questions</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
      <p><b>Thanks For Visiting, Have A Great Day!!</b></p>

    </footer>
  );
};

export default Footer;
