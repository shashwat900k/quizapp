import React from 'react';

const ShowLeaderBoard = (props) => {
  let leaderBoardTopTen = props.leaderBoardScores;
  if (typeof leaderBoardTopTen != "object") {
    leaderBoardTopTen = JSON.parse(leaderBoardTopTen);
  }

  let contentToDisplay = [
    <div key={0} className="header name-in-div">Name </div>,
    <div key={1} className="score-in-div header">Score </div>
  ];

  let moreContent = leaderBoardTopTen.map(function (valueAtIndex,index) {
    return (
      <div key={index+2}>
        <div className="name-in-div">
          {valueAtIndex.userName}
        </div>
        <div className="score-in-div">
          {valueAtIndex.userScore}
        </div>
      </div>
    );
  });
  contentToDisplay = [...contentToDisplay, ...moreContent];

  return (
    <div className="col-xs-3 leaderboard">
      {contentToDisplay}
    </div>
  );
};

export default ShowLeaderBoard;
