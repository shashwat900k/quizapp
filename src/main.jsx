import "./../node_modules/bootstrap/dist/css/bootstrap.css";
import "babel-core/register";
import "babel-polyfill";
import "./assets/css/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import jsonQuestions from "./components/questionBank.js";
import CompletionMessage from "./components/completionMessage.jsx";
import Question from "./components/question.jsx";
import Timer from "./components/timer.jsx";
import PlayernInfoForm from "./components/playerInfo.jsx";
import ScoreCard from "./components/scoreCard.jsx";
import ShowLeaderBoard from "./components/showLeaderBoard.jsx";
import {selectAndRemoveQuestion} from "./components/globalUtilFunctions.js";
import {getTopTenScores} from "./utils/apis";
import {postUserNameAndScore} from "./utils/apis";

let questionsLength = 0, leaderBoardScores = [], posted = 0,gameDuration=120;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTestCompleted: 0, // indicates whether test is completed or not
      questionsLoaded: 0, // whether the question from the json files are loaded or not
      currentQuestion: 0, //stores the current question
      userScore: 0,   // stores user score
      playerName: null, // stores the name submitted by the player
      timeRemainingAtCompletion: null, // time remaining on the clock when game completed
      timeOfBeginning: 0, // stores the time when the game begun
      attempted: 0 // total number of questions attempted at given point
    };
  }

  componentWillMount() {
    //Checks whether game completed every 0.1s
    this.checkCompletion = setInterval(this.checkTestCompletion, 100);

    // retrieves top 10 scores (by calling gTTS in globalUtilFunc) from DB when the promise is resolved
    let leaderBoardPromise = getTopTenScores();
    leaderBoardPromise.then(data =>{
      leaderBoardScores = data;
      });

  }


  checkTestCompletion = () => {

    if (this.state.isTestCompleted) {
      //Post user score to DB on test completion
      if (!posted) {
        postUserNameAndScore(this.state);
        posted = 1;
      }
      //Since game completed remove Interval to check game completion
      clearInterval(this.checkCompletion);

    }

    //checks if all the questions are loaded from JSON file and if a question selected for user yet
    if (jsonQuestions && !(this.state.questionsLoaded)) {
      questionsLength = jsonQuestions.length;

      //Selects a question from the question set
      this.setState({
        questionsLoaded: 1,
        currentQuestion: selectAndRemoveQuestion(jsonQuestions)
      });
    }

  };

  //On submitting of an option, this funcn is called to check how many points to
  // be awarded for this question
  checkAnswerAndCalculateScore = (scoreValue) => {

    // If more questions are remaining
    if (jsonQuestions.length) {
      this.setState(prevState => ({
        userScore: prevState.userScore + scoreValue,// scoreValue: points awarded for this quesn
        currentQuestion: selectAndRemoveQuestion(jsonQuestions), // select a new quesn randomly
        attempted: prevState.attempted + 1 // increment attempts by 1
      }));

    } else {
      // If no questions remaining, end the game

      let temp = (Date.now() - this.state.timeOfBeginning) / 1000;

      this.setState(prevState => ({
        isTestCompleted: 1, // to indicate test completed
        userScore: prevState.userScore + scoreValue,
        timeRemainingAtCompletion: gameDuration - temp,
        attempted: prevState.attempted + 1
      }));

    }

  };


  actionOnTimeOver = () => {

    // when no time is remaining on the timer finish the test
    this.setState({
      isTestCompleted: 1,
      timeRemainingAtCompletion: 0
    })

  };

  setPlayerName = (name) => {

    //setting player name and the start time of game
    this.setState({
      playerName: name,
      timeOfBeginning: Date.now()
    });

  };

  render() {
    //initially show form asking for player name
    if (!(this.state.playerName)) {
      return <PlayernInfoForm setName={this.setPlayerName}/>

    }

    // On getting the player name, begin the game
    else if (!(this.state.isTestCompleted)) {
      return (
        <div className="main">
          <div className="col-xs-12 main-container">
            <div className="col-xs-3 time-score-container">
              <div className="sub-time-container">
                {/* Timer: only shows the time remaining on the clock*/}
                <Timer start={gameDuration*1000}
                       actionOnTimeOver={this.actionOnTimeOver}
                       isTestCompleted={this.state.isTestCompleted}/>
              </div>
              {/*ScoreCard: shows user score at given point in the game */}
              <div className="sub-score-container">
                <ScoreCard userScore={this.state.userScore}/>
              </div>
            </div>
            {/*Question: displays question along with options and DoubleIt, TripleIt and Submit bttns */}
            <div className="question-container col-xs-6">
              <Question currentQuestion={this.state.currentQuestion}
                        checkAnswer={this.checkAnswerAndCalculateScore}/>
            </div>
            {/*LeaderBoard: Shows top 10 scores at the time of beginning of the game */}
            <ShowLeaderBoard leaderBoardScores={leaderBoardScores}/>
          </div>
        </div>
      );
    }

    // when both user-info submitted and game also finished
    else {
      return (
        // CompletionMessage: Shows user[score,name] question[attempted,un-attempted] on game completion
        <CompletionMessage
          score = {this.state.userScore}
          timeRemaining = {this.state.timeRemainingAtCompletion}
          userName = {this.state.playerName}
          attempted = {this.state.attempted}
          questionsLength = {questionsLength}
        />
      );
    }
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
