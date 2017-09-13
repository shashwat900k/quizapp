
import "./../node_modules/bootstrap/dist/css/bootstrap.css";
import "babel-core/register";
import "babel-polyfill";
import "./main.scss";
import React from "react";
import ReactDOM from "react-dom";

import Question from "./question.jsx";
import Timer from "./timer.jsx";
import PlayernInfoForm from "./playerinfo.jsx";
import ScoreCard from "./scorecard.jsx";
import ShowLeaderBoard from "./showleaderboard.jsx";

let jsonQuestions=null,questionsLength=0,question,flag=1,leaderBoardScores=[],posted=0;

function selectAndRemoveQuestion(){
  let randomQuestionIndex = Math.floor(Math.random()*jsonQuestions.length);
  let randomQuestion = jsonQuestions[randomQuestionIndex];
  jsonQuestions.splice(randomQuestionIndex,1);
  console.log(randomQuestion,jsonQuestions.length);
  return Object.values(randomQuestion);
}

function getTopTenScores(){
  fetch("/getTop10", {
    method: "GET",
  }).then(function(greetings){
    return greetings.text();
  }).then(data =>{
    leaderBoardScores = data;
  });
}

const CompletionMessage = (props) =>{
  return(
    <div className="col-xs-12">
    <div className="col-xs-3">
    &nbsp;
    </div>
    <div className="quiz-complete-message col-xs-9">
    <h1>Congratulations {props.username}, you finished the quiz</h1>
    <h2>Your Score: {props.score} </h2>
    <h2>Number of questions answered: {questionsLength-jsonQuestions.length-flag}</h2>
    <h2>Number of questions unanswered: {jsonQuestions.length+flag}</h2>
    <h2>Time remaining on the clock: {props.timeRemaining}.toFixed(1)</h2>
    </div>
    </div>
  );
}


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isTestCompleted: 0, //required
      doubleIt: 0,
      tripleIt: 0,
      userScore: 0,   //required
      currentQuestion: 0, //required
      timeOnClock: Date.now() + 120000000000000000,  //to represent a very large time
      timeRemainingAtCompletion: null, //required
      playerName: null, // required
      questionsLoaded: 0, // required
      timeOfBeginning: 0 // required
    };
  }

  componentWillMount = () =>{
    this.checkCompletion = setInterval(this.checkTestCompletion,100);
    leaderBoardScores = getTopTenScores();
    jsonQuestions = require("./question.json");
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

  checkTestCompletion = () =>{
    if(this.state.timeOnClock<=0 || this.state.isTestCompleted!=0){
      this.setState(prevState =>({
        timeOnClock: 0,
        isTestCompleted: 1,
        timeRemainingAtCompletion: (prevState.timeRemainingAtCompletion==null?0:prevState.timeRemainingAtCompletion)
      }));
      if(posted==0){
        this.postUserNameAndScore();
        posted = 1;
      }
      clearInterval(this.checkCompletion);
    }
    if(jsonQuestions!=null && this.state.questionsLoaded==0){
      questionsLength = jsonQuestions.length;
      this.setState({
        questionsLoaded: 1,
        currentQuestion: selectAndRemoveQuestion()
      });
    }
  }

  checkAnswerAndCalculateScore = (answerSelected) => {
    let correct = (answerSelected == this.state.currentQuestion[5] ? 10 : 0);
    let doubleOrTriple = this.state.doubleIt * 2 + this.state.tripleIt * 3;
    flag=0;

    if(correct == 0 && doubleOrTriple != 0)
      correct = -1 * (doubleOrTriple - 1) * 10
    else if(correct!=0 && doubleOrTriple!=0)
      correct = doubleOrTriple*10;

    if(jsonQuestions.length!=0){
      this.setState(prevState =>({
        userScore: prevState.userScore+correct,
        doubleIt: 0,
        tripleIt: 0,
        currentQuestion: selectAndRemoveQuestion()
      }));
    }
    else{
      let temp = (Date.now()-this.state.timeOfBeginning)/1000;
      this.setState(prevState =>({
        isTestCompleted: 1,
        userScore: prevState.userScore+correct,
        doubleIt: 0,
        tripleIt: 0,
        timeRemainingAtCompletion: 120-temp
      }));
    }
  }

  increaseStake = (buttonClicked) =>{
    let double=0,triple=0;
    if(buttonClicked=="double-it")
      double = 1;
    else
      triple=1;
    this.setState({
      doubleIt: double,
      tripleIt: triple
    });
  }

  setPlayerName = (name) =>{
    this.setState({
      playerName: name,
      timeOnClock: 120000,
      timeOfBeginning: Date.now()
    });
  }

  render () {
    if(this.state.playerName==null){
      return(
        <PlayernInfoForm setName={this.setPlayerName} />
      )}
    else if(this.state.isTestCompleted==0){
      return(
        <div className="main">
        <div className="col-xs-12 main-container">
        <div className="col-xs-3 time-score-container">
        <div className="sub-time-container">
        <Timer start={this.state.timeOnClock}/>
        </div>
        <div className="sub-score-container">
        <ScoreCard userscore={this.state.userScore} />
        </div>
        </div>
        <div className="question-container col-xs-6">
        <Question currentQuestion={this.state.currentQuestion}
        checkAnswer = {this.checkAnswerAndCalculateScore}
        increaseStake = {this.increaseStake} />
        </div>
        <ShowLeaderBoard leaderBoardScores = {leaderBoardScores} />
        </div>
        </div>
      );
    }
    else{
      return(
        <CompletionMessage score={this.state.userScore} timeRemaining={this.state.timeRemainingAtCompletion} username={this.state.playerName} />
      );
    }
  }
}
ReactDOM.render(<App />, document.getElementById("app"));

