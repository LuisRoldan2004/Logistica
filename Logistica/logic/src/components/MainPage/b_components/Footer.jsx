// src/components/Footer.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              We provide innovative solutions for supply chain optimization, helping businesses to
              streamline their logistics and improve efficiency.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email: info@company.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Supply Chain Blvd, Suite 100</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
            <p>&copy; 2024 Supply Chain Optimization. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
