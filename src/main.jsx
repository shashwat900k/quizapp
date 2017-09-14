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

let questionsLength = 0, leaderBoardScores = [], posted = 0;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTestCompleted: 0, //required
      questionsLoaded: 0, // required
      currentQuestion: 0, //required
      userScore: 0,   //required
      playerName: null, // required
      timeRemainingAtCompletion: null, //required
      timeOfBeginning: 0, // required
      attempted: 0
    };
  }

  componentWillMount() {

    this.checkCompletion = setInterval(this.checkTestCompletion, 100);

    let leaderBoardPromise = getTopTenScores();
    leaderBoardPromise.then(data =>{
      leaderBoardScores = data;
      });

  }


  checkTestCompletion = () => {

    if (this.state.isTestCompleted) {

      if (!posted) {
        postUserNameAndScore(this.state);
        posted = 1;
      }
      clearInterval(this.checkCompletion);

    }

    if (jsonQuestions && !(this.state.questionsLoaded)) {
      questionsLength = jsonQuestions.length;
      this.setState({
        questionsLoaded: 1,
        currentQuestion: selectAndRemoveQuestion(jsonQuestions)
      });
    }

  };

  checkAnswerAndCalculateScore = (scoreValue) => {

    if (jsonQuestions.length) {
      this.setState(prevState => ({
        userScore: prevState.userScore + scoreValue,
        currentQuestion: selectAndRemoveQuestion(jsonQuestions),
        attempted: prevState.attempted + 1
      }));

    } else {
      let temp = (Date.now() - this.state.timeOfBeginning) / 1000;

      this.setState(prevState => ({
        isTestCompleted: 1,
        userScore: prevState.userScore + scoreValue,
        timeRemainingAtCompletion: 120 - temp,
        attempted: prevState.attempted + 1
      }));

    }

  };

  actionOnTimeOver = () => {

    this.setState({
      isTestCompleted: 1,
      timeRemainingAtCompletion: 0
    })

  };

  setPlayerName = (name) => {

    this.setState({
      playerName: name,
      timeOfBeginning: Date.now()
    });

  };

  render() {
    if (!(this.state.playerName)) {
      return <PlayernInfoForm setName={this.setPlayerName}/>

    }

    else if (!(this.state.isTestCompleted)) {
      return (
        <div className="main">
          <div className="col-xs-12 main-container">
            <div className="col-xs-3 time-score-container">
              <div className="sub-time-container">
                <Timer start={30000}
                       actionOnTimeOver={this.actionOnTimeOver}
                       isTestCompleted={this.state.isTestCompleted}/>
              </div>
              <div className="sub-score-container">
                <ScoreCard userScore={this.state.userScore}/>
              </div>
            </div>
            <div className="question-container col-xs-6">
              <Question currentQuestion={this.state.currentQuestion}
                        checkAnswer={this.checkAnswerAndCalculateScore}/>
            </div>
            <ShowLeaderBoard leaderBoardScores={leaderBoardScores}/>
          </div>
        </div>
      );
    }

    else {
      return (
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
