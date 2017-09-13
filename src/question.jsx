let React = require('react');
export default class Question extends React.Component{
  //uses no gobal functions
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
    let buttonClicked = event.currentTarget.id;
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
      options.push(<span className="radio-buttons"><input type="radio" display="block" value={this.props.currentQuestion[i]}
      checked = {this.props.currentQuestion[i]==this.state.selectedOption} onChange={this.handleChange}/></span>);
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
      <button className="btn btn-default col-xs-6 increase-stake" id="double-it" style={{backgroundColor: this.state.doubleScore}} type="submit" onClick={this.handleDoubleTriple}><p>Double IT!</p>Get 20 or Lose 10</button>
      </div>
      <div className="col-xs-6">
      <button className="btn btn-default col-xs-6 increase-stake" id="triple-it" type="submit" style={{backgroundColor: this.state.tripleScore}} onClick={this.handleDoubleTriple}><p>Triple IT!</p>Get 30 or Lose 20</button>
      </div>
      </div>
      </form>
    )
  }
}

