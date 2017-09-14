import React from 'react';

const ScoreCard = (props) => {
  return (
    <div className="score">
      {props.userScore}
    </div>
  )
};

export default ScoreCard;
