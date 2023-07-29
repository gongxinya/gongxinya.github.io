// JumpingArrow.js (or any other component file)

import React, { useState } from 'react';
import '../css/style.css'; // Make sure to import the CSS file containing the animation
import SliderIcon from '../icon/slider.png'

const JumpingArrow = () => {
  const [isJumping, setIsJumping] = useState(true);

  const handleOnClick = () => {
    setIsJumping(false);
  };

  return (
    <div className={isJumping ? 'jumping-arrow' : ''} onClick={handleOnClick}>
      <img src={SliderIcon} alt="Slider Icon" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default JumpingArrow;
