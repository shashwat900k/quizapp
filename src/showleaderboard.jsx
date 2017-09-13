import React from 'react';

const ShowLeaderBoard = (props) => {
  let leaderBoardTopTen = props.leaderBoardScores;

  if (typeof leaderBoardTopTen !== "object") {
    leaderBoardTopTen = JSON.parse(leaderBoardTopTen);
  }

  let contentToDisplay = [
    <div key={0} className="header name-in-div">Name </div>,
    <div key={1} className="score-in-div header">Score </div>
  ];

  let moreContent = leaderBoardTopTen.map(function (valueAtIndex) {
    return (
      <div>
        <div className="name-in-div">
          {valueAtIndex.username}
        </div>
        <div className="score-in-div">
          {valueAtIndex.userscore}
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
