import React from "react";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
      counter: 0
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 100);
  }

  tick = () => {
    if (this.props.start) {
      this.setState(prevState => ({
        timeRemaining: this.props.start - prevState.counter,
        counter: prevState.counter + 100
      }));

      if (this.state.timeRemaining <= 0) {
        this.setState({
          timeRemaining: 0
        }, () => this.props.actionOnTimeOver());
      }
    }

    if (this.props.isTestCompleted) {
      clearInterval(this.timer);
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const elapsed = Math.round(this.state.timeRemaining / 100);
    const seconds = (elapsed / 10).toFixed(1);
    return (
      <div className="timer">
        <p className="time-remaining"><b>
          {seconds} <span className="seconds">S</span></b></p>
      </div>
    );
  }
}

export default Timer;