// Navbar.js
import React from 'react';
import '../style/NavBar.css';

const Navbar = ({onShowMap, onSignOut, isLandingPage}) => {
    return (
        <div className="navbar">
            <div id='navBarTitle'>
                <div id='capitalP'>P
                </div>
                <a href="/">Pigeon Post</a>
            </div>
            <div id='navBarRightSide'>
                { !isLandingPage && <button onClick={onSignOut}id='navBarViewMapButton'>Sign Out</button> }
            </div>
        </div>
    );
}

export default Navbar;
