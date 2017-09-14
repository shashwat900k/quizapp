import React from 'react';
import {calculateScore} from './globalUtilFunctions.js';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 0,
      doubleScore: "#cc3300",
      tripleScore: "#cc3300",
      doubleIt: 0,
      tripleIt: 0
    }
  }

  increaseStake = (buttonClicked) => {
    let double = 0, triple = 0;

    if (buttonClicked === "double-it") {
      double = 1;
    } else {
      triple = 1;
    }

    this.setState({
      doubleIt: double,
      tripleIt: triple
    });
  };

  calculateScoreForCurrentQuestion = () => {

    let scoreValue = calculateScore(
      this.state.selectedOption,
      this.props.currentQuestion[5],
      this.state.doubleIt,
      this.state.tripleIt
    );

    this.setState({
      doubleIt: 0,
      tripleIt: 0
    });

    this.props.checkAnswer(scoreValue);
  };


  handleChange = (changeEvent) => {

    this.setState({
      selectedOption: changeEvent.target.value
    });

  }

  handleSubmit = (event) => {

    event.preventDefault();
    this.setState({
      selectedOption: 0,
      tripleScore: "#cc3300",
      doubleScore: "#cc3300"
    })

    this.calculateScoreForCurrentQuestion();

  }

  handleDoubleTriple = (event) => {

    event.preventDefault();
    if (event.currentTarget.id === "double-it") {
      this.setState({
        doubleScore: "#339966",
        tripleScore: "#cc3300"
      });
    }
    else {
      this.setState({
        tripleScore: "#339966",
        doubleScore: "#cc3300"
      });
    }

    this.increaseStake(event.currentTarget.id);

  }

  render() {
    let optionSelected = this.state.selectedOption;
    let options = this.props.currentQuestion.filter((value, index) => index >= 1 && index <= 4);

    options = options.map((valueAtIndex, i) => {
        const checked = optionSelected === valueAtIndex;
        return (
          <div key={i}>
            <span className="radio-buttons">
              <input type="radio" value={valueAtIndex} checked={checked}
                     onChange={this.handleChange}/>
            </span>
            <span className="options">{valueAtIndex}</span>
            <p></p>
          </div>
        )
      });

    return (
      <form>
        <h4 className="main-question">{this.props.currentQuestion[0]}</h4>
        <div>
          {options}
        </div>
        <div className="submit-container">
          <button className="btn btn-default submit-button" type="submit"
                  onClick={this.handleSubmit} disabled={!(optionSelected)}>
            Save Answer
          </button>
        </div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <button className="btn btn-default col-xs-6 increase-stake" id="double-it"
                    style={{backgroundColor: this.state.doubleScore}} type="submit"
                    onClick={this.handleDoubleTriple}>
              <p>Double IT!</p>Get 20 or Lose 10
            </button>
          </div>
          <div className="col-xs-6">
            <button className="btn btn-default col-xs-6 increase-stake" id="triple-it"
                    type="submit" style={{backgroundColor: this.state.tripleScore}}
                    onClick={this.handleDoubleTriple}>
              <p>Triple IT!</p>Get 30 or Lose 20
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default Question;

