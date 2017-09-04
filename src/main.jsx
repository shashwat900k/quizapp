let jQuery = require('jquery');
import $ from "jquery";
import './../node_modules/bootstrap/dist/css/bootstrap.css';
import './playernames.js'
require("babel-core/register");
require("babel-polyfill");
require("./main.scss");
let React = require('react');
let ReactDOM = require('react-dom');
let mysql = require('mysql');
let jsonQuestions=null,replicaOfJSONQuestions,question,flag=1;
jsonQuestions = require('./question.json');

let pool =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tutorial'
  });


function swap(index1,index2){
  let temp;
  temp = replicaOfJSONQuestions[index2];
  replicaOfJSONQuestions[index2] = replicaOfJSONQuestions[index1];
  replicaOfJSONQuestions[index1] = temp;
}

function selectAndRemoveQuestion(){
  let randomQuestionIndex = Math.floor(Math.random()*replicaOfJSONQuestions.length);
  let randomQuestion = replicaOfJSONQuestions[randomQuestionIndex];
  swap(randomQuestionIndex,replicaOfJSONQuestions.length-1);
  replicaOfJSONQuestions.pop();
  let questionAndOptions = Object.values(randomQuestion);
  return questionAndOptions;
}

let checkLoading = $.when(jsonQuestions);
checkLoading.done(function(){
  replicaOfJSONQuestions = jQuery.extend(true, [] , jsonQuestions);
  //console.log(pool.host);
  class PlayernInfoForm extends React.Component{
    constructor (props) {
      super(props);
      this.state={
        name: ""
      }
    }

    handleNameChange = (event) =>{
      let val = event.target.value;
      this.setState({
        name: val
      });
    }

    handleSubmit = (event) =>{
      event.preventDefault();
      let nameValue = this.state.name;
      this.props.setName(nameValue);
    }

    render(){
      return(
        <div className="player-info-container">
        <div className="col-xs-3">
        &nbsp;
        </div>
        <div className="col-xs-6">
        <form className = "player-info-form">
        <input type="text" className="input-name" name="name" placeholder="Player 1" onChange={this.handleNameChange} />
        <div><button className="btn btn-default submit-name-button" type="submit" onClick={this.handleSubmit} disabled={this.state.name=="" ? 1:0}>Submit Name</button></div>
        </form>
        </div>
        </div>
      );
    }
  }

  class Timer extends React.Component{
    constructor (props) {
      super(props);
      this.state = {
        timeRemaining: 0
      };
    }

    componentDidMount =() =>{
      this.timer = setInterval(this.tick, 100);
    }

    tick = () =>{
      if(this.props.start!=0){
        this.setState({
          timeRemaining: this.props.start - new Date()})
        if(this.state.timeRemaining<0){
          clearInterval(this.timer);
          this.setState({
            timeRemaining: 0});
        }
      }
    }

    render() {
      var elapsed = Math.round(this.state.timeRemaining / 100);
      var seconds = (elapsed / 10).toFixed(1);
      return(
        <div className="col-xs-3 timer-container">
        <div className="timer">
        <p className="time-remaining"><b>{seconds} <span className="seconds">S</span></b></p>
        </div>
        </div>
      );
    }
  }

  const CompletionMessage = (props) =>{
    return(
      <div className="col-xs-12">
      <div className="col-xs-3">
      &nbsp;
      </div>
      <div className="quiz-complete-message col-xs-9">
      <h1>Congratulations, you finished the quiz</h1>
      <h2>Your Score: {props.score} </h2>
      <h2>Number of questions answered: {jsonQuestions.length-replicaOfJSONQuestions.length-flag}</h2>
      <h2>Number of questions unanswered: {replicaOfJSONQuestions.length+flag}</h2>
      <h2>Time remaining on the clock: {(props.timeRemaining/1000).toFixed(1)}</h2>
      </div>
      </div>
    );
  }

  class Question extends React.Component{
    constructor (props) {
      super(props);
      this.state = {
        selectedOption: 0,
        doubleScore: "#cc3300",
        tripleScore: "#cc3300"
      }
    }

    handleChange = (changeEvent) =>{
      this.setState({
        selectedOption: changeEvent.target.value
      });
    }

    handleSubmit = (event) =>{
      event.preventDefault();
      let selectedAnswer=this.state.selectedOption;
      this.setState({
        selectedOption: 0,
        tripleScore: "#cc3300",
        doubleScore: "#cc3300"
      })
      this.props.checkAnswer(selectedAnswer);
    }

    handleDoubleTriple = (event) =>{
      event.preventDefault();
      let buttonClicked = $(event.currentTarget).attr('id');
      if(buttonClicked=="double-it"){
        this.setState({
          doubleScore: "#339966",
          tripleScore: "#cc3300"
        });
      }
      else{
        this.setState({
          tripleScore: "#339966",
          doubleScore: "#cc3300"
        });
      }
      this.props.increaseStake(buttonClicked);
    }

    render(){
      let options = [];
      for(let i=1;i<this.props.currentQuestion.length-1;i++){
        let optionDisplay = this.props.currentQuestion[i];
        options.push(<span className="radio-buttons"><input type="radio" display="block" value={this.props.currentQuestion[i]} checked = {this.props.currentQuestion[i]==this.state.selectedOption} onChange={this.handleChange}/></span>);
        options.push(<span  className="options">{this.props.currentQuestion[i]}</span>);
        options.push(<p></p>);
      }
      return(
        <form >
        <h4>{this.props.currentQuestion[0]}</h4>
        <div>
        {options}
        </div>
        <div className="submit-container">
        <button className="btn btn-default submit-button" type="submit"  onClick={this.handleSubmit} disabled={this.state.selectedOption==0}>Save Answer</button>
        </div>
        <div className="col-xs-12">
        <div className="col-xs-6">
        <button className="btn btn-default col-xs-6 increase-stake" id="double-it" style={{backgroundColor: this.state.doubleScore, color:"#fff"}} type="submit" onClick={this.handleDoubleTriple}><p>Double IT!</p>Get 20 or Lose 10</button>
        </div>
        <div className="col-xs-6">
        <button className="btn btn-default col-xs-6 increase-stake" id="triple-it" type="submit" style={{backgroundColor: this.state.tripleScore, color:"#fff"}} onClick={this.handleDoubleTriple}><p>Triple IT!</p>Get 30 or Lose 20</button>
        </div>
        </div>
        </form>
      )
    }
  }


  class App extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        isTestCompleted: 0,
        isAnswerSubmitted: 0,
        doubleIt: 0,
        tripleIt: 0,
        userScore: 0,
        currentQuestion: selectAndRemoveQuestion(),
        timeOnClock: Date.now() + 1200000,
        timeRemainingAtCompletion: 0,
        playerName: null
      };
    }

    componentDidMount = () =>{
      this.checkCompletion = setInterval(this.checkTestCompletion,100);
    }

    postUserNameAndScore = () =>{
      fetch('/', {
      method: 'POST',
      data: {
        name: this.state.playerName,
        score: this.state.userScore
      }});
    }

    checkTestCompletion = () =>{
      if(this.state.timeOnClock<=Date.now() && this.state.timeOnClock!=-null){
        this.setState({
          timeOnClock: 0,
          isTestCompleted: 1,
          timeRemainingAtCompletion: 0
        })
        this.postUserNameAndScore();
        clearInterval(this.checkCompletion);
      }
    }

    checkAnswerAndCalculateScore = (answerSelected) =>{
      let correct = (answerSelected==this.state.currentQuestion[5]?10:0);
      let doubleOrTriple = this.state.doubleIt*2+this.state.tripleIt*3;
      flag=0;
      if(correct==0 && doubleOrTriple!=0)
        correct = -1*(doubleOrTriple-1)*10
      else if(correct!=0 && doubleOrTriple!=0)
        correct = doubleOrTriple*10;
      if(replicaOfJSONQuestions.length!=0){
        this.setState(prevState =>({
          userScore: prevState.userScore+correct,
          doubleIt: 0,
          tripleIt: 0,
          currentQuestion: selectAndRemoveQuestion()
        }));
      }
      else{
        this.setState(prevState =>({
          isTestCompleted: 1,
          userScore: prevState.userScore+correct,
          doubleIt: 0,
          tripleIt: 0,
          timeRemainingAtCompletion: prevState.timeOnClock-new Date()
        }));
        this.postUserNameAndScore();
        clearInterval(this.checkCompletion);
      }
    }

    increaseStake = (buttonClicked) =>{
      let double=0,triple=0;
      if(buttonClicked=='double-it')
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
        timeOnClock: Date.now()+120000
      });
    }

    render () {
      console.log(this.state.playerName);
      console.log(pool.host);
      if(this.state.playerName==null){
        return(
          <PlayernInfoForm setName={this.setPlayerName} />
        )}
      else if(this.state.isTestCompleted==0){
        return(
          <div className="col-xs-12">
          <Timer start={this.state.timeOnClock} />
          <div className="question-container col-xs-6">
          <Question currentQuestion={this.state.currentQuestion}
          checkAnswer = {this.checkAnswerAndCalculateScore}
          increaseStake = {this.increaseStake} />
          </div>
          <div className="user-score col-xs-3">
          <div className="score">
          {this.state.userScore}
          </div>
          </div>
          </div>
        );
      }
      else{
        return(
          <CompletionMessage score={this.state.userScore} timeRemaining={this.state.timeRemainingAtCompletion} />
        );
      }
    }
  }
  ReactDOM.render(<App />, document.getElementById("app"));
});



