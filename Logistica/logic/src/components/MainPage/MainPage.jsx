import React from 'react';
import Footer from './b_components/Footer';
import Slider from './b_components/Slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Content from './b_components/Content';


const MainPage = () => {
 
  return (
    <>
        <Slider/>
        <Content/>
        <Footer/>
    </>
  );
};

export default MainPage;
