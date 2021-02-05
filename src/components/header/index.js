import React from 'react';
import logo from '../../logo.svg';
import './style.css';

const Header = () => (
  <header className="Header">
    <div className="MarvelBrand">
      <img src={logo} className="img-responsive center-block MarvelBrand-logo" alt="Marvel logo" />
      <small>Marvel Character Search</small>
    </div>
  </header>
);

export default Header;
