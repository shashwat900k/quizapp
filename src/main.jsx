import "./../node_modules/bootstrap/dist/css/bootstrap.css";
import "babel-core/register";
import "babel-polyfill";
import "./main.scss";
import React from "react";
import ReactDOM from "react-dom";
import jsonQuestions from "./questionbank.js";
import CompletionMessage from "./completionmessage.jsx";
import Question from "./question.jsx";
import Timer from "./timer.jsx";
import PlayernInfoForm from "./playerinfo.jsx";
import ScoreCard from "./scorecard.jsx";
import ShowLeaderBoard from "./showleaderboard.jsx";
import {selectAndRemoveQuestion} from "./globalutilfunctions.js";

let questionsLength = 0 ,question ,leaderBoardScores = [] ,posted = 0;

function getTopTenScores(){
  fetch("/getTop10", {
    method: "GET",
  }).then( function(greetings) {
    return greetings.text();
  }).then( data => {
    leaderBoardScores = data;
  });
}

class App extends React.Component {
  constructor (props) {
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

  componentWillMount = () =>{
    this.checkCompletion = setInterval(this.checkTestCompletion,100);
    leaderBoardScores = getTopTenScores();
  }

  postUserNameAndScore = () =>{
    fetch("/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify({
        name: this.state.playerName,
        score: this.state.userScore
      })
    });
  }

  checkTestCompletion = () => {
    if(this.state.isTestCompleted != 0){
      if(posted == 0){
        this.postUserNameAndScore();
        posted = 1;
      }
      clearInterval(this.checkCompletion);
    }

    if(jsonQuestions != null && this.state.questionsLoaded == 0){
      questionsLength = jsonQuestions.length;
      this.setState({
        questionsLoaded: 1,
        currentQuestion: selectAndRemoveQuestion(jsonQuestions)
      });
    }

  }

  checkAnswerAndCalculateScore = (scoreValue) => {
    if(jsonQuestions.length != 0){
      this.setState(prevState => ({
        userScore: prevState.userScore + scoreValue,
        currentQuestion: selectAndRemoveQuestion( jsonQuestions),
        attempted: prevState.attempted + 1
      }));
    }
    else{
      let temp = (Date.now() - this.state.timeOfBeginning)/1000;
      this.setState(prevState => ({
        isTestCompleted: 1,
        userScore: prevState.userScore + scoreValue,
        timeRemainingAtCompletion: 120 - temp,
        attempted: prevState.attempted + 1
      }));
    }
  }

  actionOnTimeOver = () =>{
    this.setState({
      isTestCompleted: 1,
      timeRemainingAtCompletion: 0
    })
  }

  setPlayerName = (name) =>{
    this.setState({
      playerName: name,
      timeOfBeginning: Date.now()
    });
  }

  render () {
    if( this.state.playerName == null) {
      return(
        <PlayernInfoForm setName = { this.setPlayerName} />
      )}

    else if(this.state.isTestCompleted == 0) {
      return(
        <div className = "main">
        <div className = "col-xs-12 main-container">
        <div className = "col-xs-3 time-score-container">
        <div className = "sub-time-container">
        <Timer start={ 30000}
        actionOnTimeOver = {this.actionOnTimeOver}
        isTestCompleted = {this.state.isTestCompleted}/>
        </div>
        <div className = "sub-score-container">
        <ScoreCard userscore = { this.state.userScore} />
        </div>
        </div>
        <div className = "question-container col-xs-6">
        <Question currentQuestion = { this.state.currentQuestion}
        checkAnswer = { this.checkAnswerAndCalculateScore} />
        </div>
        <ShowLeaderBoard leaderBoardScores = { leaderBoardScores} />
        </div>
        </div>
      );
    }

    else{
      return(
        <CompletionMessage score = { this.state.userScore} timeRemaining = { this.state.timeRemainingAtCompletion} username = { this.state.playerName}
        attempted = {this.state.attempted} questionsLength = {questionsLength}/>
      );
    }

  }
}
ReactDOM.render(<App />, document.getElementById("app"));

