import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
      counter: 0
    };
  }

  componentDidMount() {
    //tick function invoked every 0.1s
    this.timer = setInterval(this.tick, 100);
  }

  tick = () => {
    // if test begun
    if (this.props.start) {
      // decrements timer by 0.1 in every 0.1s
      this.setState(prevState => ({
        timeRemaining: this.props.start - prevState.counter,
        counter: prevState.counter + 100
      }));
      // when timer value <0, finish the test by invoking actionOnTimeOver
      // in main.jsx
      if (this.state.timeRemaining <= 0) {
        this.setState({
          timeRemaining: 0
        }, () => this.props.actionOnTimeOver());
      }
    }
    //when test completed no point in decrementing timer by 0.1s now,
    //hence remove interval from tick
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
      <div className='timer'>
        <p className='time-remaining'><b>
          {seconds} <span className='seconds'>S</span></b></p>
      </div>
    );
  }
}

export default Timer;
