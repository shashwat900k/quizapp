import React from 'react';
const ShowLeaderBoard = (props) => {
  let leaderBoardTopTen = props.leaderBoardScores;

  if(typeof leaderBoardTopTen !== "object"){
    leaderBoardTopTen = JSON.parse(leaderBoardTopTen);
  }

  let contentToDisplay = [];

  contentToDisplay.push(<div className = "header name-in-div" >Name </div>)
  contentToDisplay.push(<div className = "score-in-div header">Score </div>);

  for(let i = 0; i < leaderBoardTopTen.length; i++){
    contentToDisplay.push(<div className = "name-in-div">
      {leaderBoardTopTen[i].username}</div>);
    contentToDisplay.push(<div className = "score-in-div">
      {leaderBoardTopTen[i].userscore}</div>);
  }

  return(
    <div className = "col-xs-3 leaderboard">
    {contentToDisplay}
    </div>
  );
}

export default ShowLeaderBoard;
