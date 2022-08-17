import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

let interval = undefined;

const pad = (n) => {
  return n < 10 ? '0' + n : n;
};

const CountDown = () => {
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState(0);

  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [max, setMax] = useState(120);

  const remaining = max - value;
  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = remaining - remainingMin * 60;
  const percentage = (value / max) * 100;
  useEffect(() => {
    if (running) {
      interval = setInterval(() => {
        setValue((value) => value + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (inputMinutes !== 0 || inputSeconds !== 0) {
      setMax(inputMinutes * 60 + inputSeconds);
    }
  }, [inputMinutes, inputSeconds]);

  useEffect(() => {
    if (isNaN(value)) {
      console.log(`its not a number`);
    }
    if (value === max && running === true) {
      let notif = new Notification('Work Done!', {
        body: 'Take a Break!!',
      });
      setRunning(false);
      clearInterval(interval);
      setTimeout(() => {
        setValue(0);
      }, 1000);
    } else if (value === 0 && running === true) {
      setRunning(false);
    }
  }, [value, max, inputMinutes, inputSeconds]);

  return (
    <div
      style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      <div style={{ width: 'full', height: '50vh' }}>
        <div
          style={{
            width: '300px',
            height: '300px',
            margin: 'auto',
          }}
        >
          <CircularProgressbar
            value={percentage}
            text={`${remainingMin}:${pad(remainingSec)}/${Math.floor(
              max / 60
            )}:${pad(max - Math.floor(max / 60) * 60)}`}
            styles={buildStyles({
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'round',

              // Text size
              textSize: '12px',

              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,

              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',

              // Colors
              pathColor: `rgb(239 68 68)`,
              textColor: '#f88',
              trailColor: '#d6d6d6',
              backgroundColor: '#f88',
            })}
          />
        </div>
      </div>

      <div style={{ height: '20vh', width: '300px' }}>
        <div style={{ height: '20vh', margin: 'auto' }}>
          {running ? (
            <button
              className='bg-transparent w-full mt-4 hover:bg-red-500 text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded'
              onClick={() => {
                setRunning(false);
              }}
            >
              Stop
            </button>
          ) : (
            <button
              className='bg-transparent w-full mt-4 hover:bg-red-500 text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded'
              onClick={() => {
                setRunning(true);
              }}
            >
              Run
            </button>
          )}
          <button
            onClick={() => {
              running ? setValue(1) : setValue(0);
            }}
            className='bg-transparent w-full mt-4 hover:bg-red-500 text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded'
          >
            Reset
          </button>
        </div>
        <div className='mt-4 w-full'>
          {!running && (
            <div className='flex w-full'>
              <div className='w-full text-center'>
                <p>Minutes</p>
                <input
                  value={inputMinutes}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) {
                      return setInputMinutes(0);
                    } else if (e.target.value.toString().length > 2) {
                      return;
                    } else if (Number(e.target.value) > 60) {
                      return setInputMinutes(60);
                    }
                    setInputMinutes(Number(e.target.value));
                  }}
                  placeholder='Min'
                  className=' bg-zinc-900 w-full text-center p-1 border rounded'
                ></input>
              </div>
              <div className='w-full text-center'>
                <p>Seconds</p>
                <input
                  placeholder='Sec'
                  className=' bg-zinc-900 w-full text-center p-1 border rounded'
                  value={inputSeconds}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) {
                      return setInputSeconds(0);
                    } else if (e.target.value.toString().length > 2) {
                      return;
                    } else if (Number(e.target.value) > 60) {
                      return setInputSeconds(60);
                    }
                    setInputSeconds(Number(e.target.value));
                  }}
                ></input>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountDown;
