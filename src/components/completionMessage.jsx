import React from 'react';

const CompletionMessage = (props) => {
  // Pass username,score, time-remaining attempts as prop and display it in completion message
  return (
    <div className='col-xs-12'>
      <div className='col-xs-3'>
        &nbsp;
      </div>
      <div className='quiz-complete-message  col-xs-9'>
        <h1>Congratulations {props.playerName}, you finished the quiz</h1>
        <h2>Your Score: {props.userScore} </h2>
        <h2>Number of questions answered: {props.attempted}</h2>
        <h2>Number of questions unanswered:
          {props.questionsLength - props.attempted}</h2>
        <h2>Time remaining on the clock: {props.timeRemainingAtCompletion.toFixed(1)}</h2>
      </div>
    </div>
  );
}

export default CompletionMessage;
