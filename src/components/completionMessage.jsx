import React from 'react';

const CompletionMessage = (props) => {
  return (
    <div className="col-xs-12">
      <div className="col-xs-3">
        &nbsp;
      </div>
      <div className="quiz-complete-message  col-xs-9">
        <h1>Congratulations {props.userName}, you finished the quiz</h1>
        <h2>Your Score: {props.score} </h2>
        <h2>Number of questions answered: {props.attempted}</h2>
        <h2>Number of questions unanswered:
          {props.questionsLength - props.attempted}</h2>
        <h2>Time remaining on the clock: {props.timeRemaining.toFixed(1)}</h2>
      </div>
    </div>
  );
}

export default CompletionMessage;
