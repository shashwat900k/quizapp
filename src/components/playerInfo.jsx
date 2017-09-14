import React from "react";

class PlayernInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    }
  }

  //store new value in state.name whenever a keystroke pressed in the form-field
  handleNameChange = (event) => {

    let valueOfName = event.target.value;
    this.setState({
      name: valueOfName
    });

  }

  handleSubmit = (event) => {
    //to prevent page refresh
    event.preventDefault();
    // stores the name on form submission and call setName in main.jsx
    // to store the name in its component's state
    let nameValue = this.state.name;
    this.props.setName(nameValue);

  }

  render() {
    return (
      <div className="player-info-container">
        <div className="col-xs-3">
          &nbsp;
        </div>
        <div className="col-xs-6">
          <form className="player-info-form">
            <input type="text" className="input-name" name="name" placeholder="Player 1"
                   onChange={this.handleNameChange}/>
            <div>
              {/* disables bttn when nothing entered in input field */}
              <button className="btn btn-default submit-name-button" type="submit"
                      onClick={this.handleSubmit} disabled={this.state.name === "" ? 1 : 0}>
                Submit Name
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PlayernInfoForm;