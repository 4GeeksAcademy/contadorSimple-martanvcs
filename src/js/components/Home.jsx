import React, { useEffect, useRef, useState } from "react";

const Home = () => {
  const [mode, setMode] = useState("countup");
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState(null);
  const [pausedAt, setPausedAt] = useState(null);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const alertedRef = useRef(false);

  const startCount = (initial) => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      if (mode === "countdown") {
        const remaining = initial - elapsed;
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setValue(0);
          if (!alertedRef.current) {
            alert(`¡Tiempo alcanzado! (${initial} segundos)`);
            alertedRef.current = true;
          }
        } else {
          setValue(remaining);
        }
      } else {
        setValue(initial + elapsed);
      }
    }, 1000);
  };

  const handleStartCountdown = () => {
    const input = document.getElementById("inputTime");
    const seconds = parseInt(input.value);
    if (isNaN(seconds) || seconds <= 0) {
      alert("Introduce un número válido mayor que 0");
      return;
    }

    clearInterval(intervalRef.current);
    setMode("countdown");
    setTarget(seconds);
    setValue(seconds);
    alertedRef.current = false;
    startCount(seconds);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
    setPausedAt(mode === "countdown" ? target - elapsed : value);
  };

  const resume = () => {
    if (pausedAt === null) return;
    alertedRef.current = false;
    startCount(pausedAt);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setPausedAt(null);
    setTarget(null);
    setMode("countup");
    setValue(0);
    startCount(0);
  };

  useEffect(() => {
    reset();
    return () => clearInterval(intervalRef.current);
  }, []);

  const digits = value.toString().padStart(6, "0").split("");

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
        <button onClick={handleStartCountdown}>Iniciar</button>
        <button onClick={pause}>Parar</button>
        <button onClick={resume}>Reanudar</button>
        <button onClick={reset}>Reiniciar</button>
      </div>
    </>
  );
};

export default Home;





