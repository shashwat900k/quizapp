import React from "react";
export default class PlayernInfoForm extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      name: ""
    }
  }

  handleNameChange = (event) => {
    let valueOfName = event.target.value;
    this.setState({
      name: valueOfName
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let nameValue = this.state.name;
    this.props.setName(nameValue);
  }

  render(){
    return(
      <div className = "player-info-container">
      <div className = "col-xs-3">
      &nbsp;
      </div>
      <div className = "col-xs-6">
      <form className = "player-info-form">
      <input type = "text" className = "input-name" name = "name" placeholder
      = "Player 1" onChange = { this.handleNameChange} />
      <div><button className = "btn btn-default submit-name-button" type = "submit" onClick = {this.handleSubmit} disabled = {this.state.name =="" ? 1: 0}>
      Submit Name
      </button>
      </div>
      </form>
      </div>
      </div>
    );
  }
}

