import React from "react";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      mode: "countup",
      target: null,
      pausedAt: null,
      alerted: false
    };
    this.interval = null;
    this.startTime = null;
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startCount(initial) {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.state.mode === "countdown") {
        const remaining = initial - elapsed;
        if (remaining <= 0) {
          clearInterval(this.interval);
          this.setState({ seconds: 0 });
          if (!this.state.alerted) {
            alert(`¡Tiempo alcanzado! (${initial} segundos)`);
            this.setState({ alerted: true });
          }
        } else {
          this.setState({ seconds: remaining });
        }
      } else {
        this.setState({ seconds: initial + elapsed });
      }
    }, 1000);
  }

  handleStartCountdown = () => {
    const input = document.querySelector("#inputTime");
    const seconds = parseInt(input.value);
    if (isNaN(seconds) || seconds <= 0) {
      alert("Introduce un número válido mayor que 0");
      return;
    }
    clearInterval(this.interval);
    this.setState(
      {
        seconds,
        mode: "countdown",
        target: seconds,
        alerted: false
      },
      () => this.startCount(seconds)
    );
  };

  pause = () => {
    clearInterval(this.interval);
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const pausedValue =
      this.state.mode === "countdown"
        ? this.state.target - elapsed
        : this.state.seconds;
    this.setState({ pausedAt: pausedValue });
  };

  resume = () => {
    if (this.state.pausedAt == null) return;
    this.setState({ alerted: false }, () => {
      this.startCount(this.state.pausedAt);
    });
  };

  reset = () => {
    clearInterval(this.interval);
    this.setState(
      {
        seconds: 0,
        mode: "countup",
        pausedAt: null,
        target: null,
        alerted: false
      },
      () => this.startCount(0)
    );
  };

  render() {
    const digits = this.state.seconds.toString().padStart(6, "0").split("");

    return (
      <>
        <div className="main-container">
          <div className="clock">
            <i className="fas fa-clock"></i>
          </div>
          {digits.map((digit, index) => (
            <div className="digit-box" key={index}>
              {digit}
            </div>
          ))}
        </div>

        <div className="controls">
          <input id="inputTime" type="number" placeholder="Tiempo (s)" />
          <button onClick={this.handleStartCountdown}>Iniciar</button>
          <button onClick={this.pause}>Parar</button>
          <button onClick={this.resume}>Reanudar</button>
          <button onClick={this.reset}>Reiniciar</button>
        </div>
      </>
    );
  }
}

export default Home;

