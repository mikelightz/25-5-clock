import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlay,
  faPlus,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const audio = document.getElementById("beep");

class App extends Component {
  state = {
    breakLength: 5, // default = 5; min = 1; max = 60
    sessionLength: 25, // default = 25; min = 1; max = 60
    clockCount: 25 * 60, // default timer display in sec (also 1500)
    currentTimer: "Session", //Timer "id"
    isTimerRunning: false,
    intervalId: undefined,
  };

  // EVENT HANDLERS
  handleStartStop = () => {
    const { isTimerRunning, intervalId } = this.state;
    if (!isTimerRunning) {
      this.setState({ isTimerRunning: true, intervalId: this.timer() });
    } else {
      clearInterval(intervalId);
      this.setState({ isTimerRunning: false });
    }
  };

  handleReset = () => {
    clearInterval(this.state.intervalId);

    audio.pause();
    audio.currentTime = 0;

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      clockCount: 25 * 60,
      currentTimer: "Session",
      isTimerRunning: false,
      intervalId: undefined,
    });
  };

  handleLengthChange = (count, timerType) => {
    const { sessionLength, breakLength, isTimerRunning, currentTimer } =
      this.state;

    let newCount;

    if (timerType === "session") {
      newCount = sessionLength + count;
    } else {
      newCount = breakLength + count;
    }

    if (newCount > 0 && newCount < 61 && !isTimerRunning) {
      this.setState({
        [`${timerType}Length`]: newCount,
      });

      if (currentTimer.toLowerCase() === timerType) {
        this.setState({
          clockCount: newCount * 60,
        });
      }
    }
  };

  // HELPER FUNCTIONS
  minutesSeconds = (time) => {
    let mins = Math.floor(time / 60); //function to calc minutes
    let secs = time - mins * 60; //function to calc seconds

    secs = secs < 10 ? "0" + secs : secs; //if seconds are less than 10 add a zero in front
    mins = mins < 10 ? "0" + mins : mins; //if minutes are less than ten add a zero in front
    return `${mins}:${secs}`; //minutes / seconds formatting
  };

  timer = () => {
    return setInterval(() => {
      this.setState((prevState) => {
        const newTime = prevState.clockCount - 1; //decrements timer

        if (prevState.clockCount === 0) {
          audio.play();
          return {
            ...prevState,
            currentTimer:
              prevState.currentTimer === "Session" ? "Break" : "Session",
            clockCount:
              prevState.currentTimer === "Session"
                ? prevState.breakLength * 60
                : prevState.sessionLength * 60,
          };
        } else {
          return {
            ...prevState,
            clockCount: newTime,
          };
        }
      });
    }, 1000);
  };

  render() {
    const {
      breakLength,
      sessionLength,
      clockCount,
      currentTimer,
      isTimerRunning,
    } = this.state;

    const breakProps = {
      title: "Break",
      count: breakLength,
      handleDecrement: () => this.handleLengthChange(-1, "break"),
      handleIncrement: () => this.handleLengthChange(1, "break"),
    };

    const sessionProps = {
      title: "Session",
      count: sessionLength,
      handleDecrement: () => this.handleLengthChange(-1, "session"),
      handleIncrement: () => this.handleLengthChange(1, "session"),
    };

    return (
      <div className="container">
        <h1 className="title">25 + 5</h1>

        <div>
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>

        <div className="clock-container">
          <h1 id="timer-label">{currentTimer}</h1>
          <span id="time-left">{this.minutesSeconds(clockCount)}</span>

          <div>
            <button id="start_stop" onClick={this.handleStartStop}>
              {isTimerRunning ? (
                <>
                  {" "}
                  <FontAwesomeIcon icon={faPause} />{" "}
                </>
              ) : (
                <>
                  {" "}
                  <FontAwesomeIcon icon={faPlay} />{" "}
                </>
              )}
            </button>
            <button id="reset" onClick={this.handleReset}>
              RESTART
            </button>
          </div>
        </div>
        <p className="signature">coded by Mike Lightz</p>
      </div>
    );
  }
}

const SetTimer = (props) => {
  const id = props.title.toLowerCase();

  return (
    <div className="timer-container">
      <h3 id={`${id}-label`}>{props.title} Length</h3>

      <div>
        <button id={`${id}-decrement`} onClick={props.handleDecrement}>
          <FontAwesomeIcon icon={faMinus} />
        </button>

        <span id={`${id}-length`}>{props.count}</span>

        <button id={`${id}-increment`} onClick={props.handleIncrement}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};

export default App;
