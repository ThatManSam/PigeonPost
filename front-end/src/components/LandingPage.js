import React, { useEffect, useState } from 'react';
import '../style/LandingPage.css';
import NavBar from './NavBar';
import Pigeon from '../Images/landingPagePigeon.png';
import CheckMark from '../Images/landingPageCheckmark.png';

const LandingPage = ({ onLoginSuccess, onShowMap }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["Journey,", "Passage,", "Quest,", "Voyage,"];
  
  const handleLogin = () => {
    onLoginSuccess();
  }

  // This does the cool typewriter effect thingy
  useEffect(() => {
    let timer;
    const changeText = () => {
      if (isDeleting) {
        setTextIndex((prevTextIndex) => prevTextIndex - 1);
      } else {
        setTextIndex((prevTextIndex) => prevTextIndex + 1);
      }
    };
    if (isDeleting) {
      timer = setTimeout(changeText, 50); // speed of typing
    } else {
      timer = setTimeout(changeText, 100);
    }
    if (textIndex === words[wordIndex].length && !isDeleting) {
      setTimeout(() => {
        setIsDeleting(true);
        clearTimeout(timer);  
    }, 1000); // Pause for 1 second at the end
    } else if (isDeleting && textIndex === 0) {
      setIsDeleting(false);
      setWordIndex((prevWordIndex) => (prevWordIndex + 1) % words.length);
    }
    return () => clearTimeout(timer);
  }, [textIndex, wordIndex, isDeleting]);

  return (
    <div id="landingPageBox">
      <NavBar onShowMap={onShowMap}/>
      <div id="landingPageContainer">
        <div id="landingPageLeft">
          <h1>Where Every Message Is A<br/> <div id='typewriter'>{words[wordIndex].substring(0, textIndex)}<span className="blinking-cursor">|</span></div> <br/>Not Just a Send.</h1>
          <p id='landingPageDescription'>Encouraging users to be present in the moment, and savor the richness of genuine connections. </p>
          {/* <div className='landingPageDivCheckMark'>
            <img className="landingPageCheckMark" src={CheckMark} alt='checkMark'/>
            <p>Relive the nostalgia</p>
          </div>
          <div className='landingPageDivCheckMark'>
            <img className="landingPageCheckMark" src={CheckMark} alt='checkMark'/>
            <p>Relax and make genuine connections</p>
          </div> */}
          <button onClick={handleLogin} id="landingPageLogin">Log in</button>
        </div>
        <div id="landingPageRight">
          <img src={Pigeon} alt="Description of Image" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
