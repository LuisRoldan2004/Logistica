import React from 'react';
import '../styles/Slider.css';

const Sider = () => {
  return (
    <div className="sider-container">
      <div className="sider-content text-center">
        <img
          src="https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg"
          className="sider-image"
          alt="Main Visual"
        />
        <div className="sider-caption">
          <h5>Optimize Your Supply Chain</h5>
          <p>Our advanced algorithms ensure the most efficient routes for your goods, reducing costs and improving delivery times.</p>
        </div>
      </div>
    </div>
  );
};

export default Sider;
