// Navbar.js
import React from 'react';
import '../style/NavBar.css';

const Navbar = ({onShowMap}) => {
    return (
        <div className="navbar">
            <div id='navBarTitle'>
                <div id='capitalP'>P
                </div>
                <a href="/">Pigeon Post</a>
            </div>
            {/* <div id='navBarRightSide'>
                <button onClick={onShowMap}id='navBarViewMapButton'>View Map</button>
            </div> */}
        </div>
    );
}

export default Navbar;
