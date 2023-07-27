import React from 'react';
import { PlayCircleTwoTone, PauseCircleTwoTone } from '@ant-design/icons';

const PlayButton = ({ isPlaying, onClick}) => {
  const buttonSize = 38; // You can adjust the size as needed

  return (
    <div onClick={onClick} style={{width: buttonSize, height: buttonSize, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      {isPlaying ? <PauseCircleTwoTone twoToneColor="#ff85c0" style={{ fontSize: buttonSize }} /> : <PlayCircleTwoTone twoToneColor="#85e085" style={{ fontSize: buttonSize }} />}
    </div>
  );
};

export default PlayButton;
