import React from 'react';

const ShowLeaderBoard = (props) => {
  // top 10 LB scores passed as props
  let leaderBoardTopTen = props.leaderBoardScores;
  if (typeof leaderBoardTopTen != "object") {
    leaderBoardTopTen = JSON.parse(leaderBoardTopTen);
  }

  //Name, score heading for leader board container
  let contentToDisplay = [
    <div key={0} className="header name-in-div">Name </div>,
    <div key={1} className="score-in-div header">Score </div>
  ];

  // Iterate through each userScore and name in top 10 and enclose it in div and push the div in below array
  let contentStoringNameAndScore = leaderBoardTopTen.map(function (valueAtIndex,index) {
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
  contentToDisplay = [...contentToDisplay, ...contentStoringNameAndScore];

  return (
    <div className="col-xs-3 leaderboard">
      {contentToDisplay}
    </div>
  );
};

export default ShowLeaderBoard;
