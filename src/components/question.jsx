import React from 'react';
import {calculateScore} from './globalUtilFunctions.js';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 0, //stores option selected at any point
      doubleScore: '#cc3300', // color of the button on clicking double-it
      tripleScore: '#cc3300', // color of the button on clicking triple-it
      doubleIt: 0, // if double-it button clicked or not
      tripleIt: 0 // if triple-it button clicked or not
    }
  }

  // on clicking double-it or triple it, set their state accordingly
  increaseStake = (buttonClicked) => {
    let double = 0, triple = 0;

    if (buttonClicked === 'double-it') {
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
    // calls calculatescore in globalUtilFunctions.js with passed args and
    // stores returned value
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

    //the returned value from calculate store is passed to below function in main.jsx
    //which adds the value in state.userscore
    this.props.checkAnswer(scoreValue);
  };


  handleChange = (changeEvent) => {
    //whenever a radio-box is clicked change the state of option selected
    this.setState({
      selectedOption: changeEvent.target.value
    });

  }

  handleSubmit = (event) => {
    //prevent from page to refresh and set states to default value
    event.preventDefault();
    this.setState({
      selectedOption: 0,
      tripleScore: '#cc3300',
      doubleScore: '#cc3300'
    })
    //calculate score to be awarded for given question on submit
    this.calculateScoreForCurrentQuestion();

  }

  handleDoubleTriple = (event) => {
    //on clicking doubleIt or triple set the color of clicked bttn to green and
    // un-clicked to red by changing there states
    event.preventDefault();
    if (event.currentTarget.id === 'double-it') {
      this.setState({
        doubleScore: '#339966',
        tripleScore: '#cc3300'
      });
    }
    else {
      this.setState({
        tripleScore: '#339966',
        doubleScore: '#cc3300'
      });
    }
    //and also set state to indicate which one(double or triple) is clicked
    this.increaseStake(event.currentTarget.id);

  }

  render() {
    let optionSelected = this.state.selectedOption;
    //filters out question and answer from array and only store options in it
    let options = this.props.currentQuestion.filter((value, index) => index >= 1 && index <= 4);

    //Iterate through each option and style it as radio button and
    // push in the array
    options = options.map((valueAtIndex, i) => {
        const checked = optionSelected === valueAtIndex;
        return (
          <div key={i}>
            <span className='radio-buttons'>
              <input type='radio' value={valueAtIndex} checked={checked}
                     onChange={this.handleChange}/>
            </span>
            <span className='options'>{valueAtIndex}</span>
            <p></p>
          </div>
        )
      });

    return (
      <form>
        <h4 className='main-question'>{this.props.currentQuestion[0]}</h4>
        <div>
          {options}
        </div>
        <div className='submit-container'>
          {/*If no option selected do not enable submit button */}
          <button className='btn btn-default submit-button' type='submit'
                  onClick={this.handleSubmit} disabled={!(optionSelected)}>
            Save Answer
          </button>
        </div>
        <div className='col-xs-12'>
          <div className='col-xs-6'>
            {/* Sets color to green if double or triple it clicked by calling handleDoubleTriple
             and changing the states accordingly and setting bg-color according to states*/}
            <button className='btn btn-default col-xs-6 increase-stake' id='double-it'
                    style={{backgroundColor: this.state.doubleScore}} type='submit'
                    onClick={this.handleDoubleTriple}>
              <p>Double IT!</p>Get 20 or Lose 10
            </button>
          </div>
          <div className='col-xs-6'>
            <button className='btn btn-default col-xs-6 increase-stake' id='triple-it'
                    type='submit' style={{backgroundColor: this.state.tripleScore}}
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

