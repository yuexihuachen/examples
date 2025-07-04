import './App.css';
import { useCountdown } from './hooks/useCountdown';

const App = () => {

  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000
  })


  return (
    <div className="content">
      <h1>Rsbuild with React 333</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <p>
        <p>Count: {count}</p>
        <button onClick={startCountdown}>start</button>
        <button onClick={stopCountdown}>stop</button>
        <button onClick={resetCountdown}>reset</button>
      </p>
    </div>
  );
};

export default App;
