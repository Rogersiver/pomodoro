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
  const [isWorkTimer, setIsWorkTimer] = useState(true);
  const [isBreakTimer, setIsBreakTimer] = useState(false);
  const [max, setMax] = useState(900);

  const Checkbox = ({ label, value, onChange }) => {
    return (
      <label
        style={{
          // backgroundColor:
          //   label === 'Work'
          //     ? value
          //       ? 'rgb(239 68 68)'
          //       : 'rgb(39 39 42)'
          //     : value
          //     ? 'rgb(20 100 20)'
          //     : 'rgb(39 39 42)',
          padding: '1vh',
          borderRadius: '10%',
          margin: 'auto',
          marginTop: '10px',
          fontSize: '1.2rem',
        }}
        className={`${
          label === 'Work'
            ? isWorkTimer
              ? 'bg-red-500'
              : 'bg-zinc-800  hover:bg-red-900'
            : isWorkTimer
            ? 'bg-zinc-800  hover:bg-green-900'
            : 'bg-green-500'
        } rounded-lg`}
      >
        <div onClick={onChange}>{label}</div>
      </label>
    );
  };

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
    if (remaining < 0) {
      setValue(0);
    }
    if (isNaN(value)) {
      console.log(`its not a number`);
    }
    if (value === max && running === true) {
      let notif;
      if (isWorkTimer) {
        notif = new Notification('Work Done!', {
          body: 'Take a Break!!',
        });
        setIsWorkTimer(false);
        setIsBreakTimer(true);
      } else {
        notif = new Notification('Break Done!', {
          body: 'Get to Work!!',
        });
        setIsWorkTimer(true);
        setIsBreakTimer(false);
      }
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
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      <div
        style={{
          marginTop: '10vh',
          width: 'full',
          height: '50vh',
        }}
      >
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
              strokeLinecap: 'butt',
              textSize: '12px',
              pathTransitionDuration: 0.5,
              pathColor: isWorkTimer ? `rgb(239 68 68)` : `rgb(20 100 20)`,
              textColor: isWorkTimer ? '#f88' : `rgb(150 200 150)`,
              trailColor: isWorkTimer ? '#d6d6d6' : `rgb(180 200 180)`,
              backgroundColor: '#f88',
            })}
          />
        </div>
      </div>
      <div className='flex'>
        <Checkbox
          label='Work'
          value={isWorkTimer}
          onChange={() => {
            if (isWorkTimer && !isBreakTimer) {
              return;
            }
            setIsWorkTimer((isWorkTimer) => !isWorkTimer);
            if (isBreakTimer) {
              setIsBreakTimer(false);
            }
          }}
        />
        <Checkbox
          label='Break'
          value={isBreakTimer}
          onChange={() => {
            if (isBreakTimer && !isWorkTimer) {
              return;
            }
            setIsBreakTimer((isBreakTimer) => !isBreakTimer);
            if (isWorkTimer) {
              setIsWorkTimer(false);
            }
          }}
        />
      </div>
      <div style={{ height: '24vh', width: '300px', margin: 'auto' }}>
        <div style={{ height: '20vh', margin: 'auto' }}>
          {running ? (
            <button
              className={`bg-zinc-800 w-full mt-4 ${
                isWorkTimer ? 'hover:bg-red-500' : 'hover:bg-green-500'
              } text-blue-dark font-semibold rounded-lg  hover:text-white py-2 px-4`}
              onClick={() => {
                setRunning(false);
              }}
            >
              Stop
            </button>
          ) : (
            <button
              className={`bg-zinc-800 w-full mt-4 ${
                isWorkTimer ? 'hover:bg-red-500' : 'hover:bg-green-500'
              } text-blue-dark font-semibold rounded-lg  hover:text-white py-2 px-4`}
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
            className={`bg-zinc-800 t w-full mt-4 ${
              isWorkTimer ? 'hover:bg-red-500' : 'hover:bg-green-500'
            } text-blue-dark font-semibold rounded-lg  hover:text-white py-2 px-4`}
          >
            Reset
          </button>
        </div>
        {!running ? (
          <div className='mt-4 w-full'>
            <div className='flex'>
              <div className='w-full mx-2 text-center'>
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
                  className='rounded-lg  bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-600 w-full text-center p-1 rounded'
                ></input>
              </div>
              <div className='w-full mx-2 text-center'>
                <p>Seconds</p>
                <input
                  placeholder='Sec'
                  className='rounded-lg  bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-600 w-full text-center p-1 rounded'
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
          </div>
        ) : (
          <div>
            {
              <div className='flex mt-2'>
                <button
                  onClick={() => {
                    setValue((value) => value - 60);
                  }}
                  className={`bg-zinc-800 w-full mr-2 ${
                    isWorkTimer ? 'hover:bg-red-500' : 'hover:bg-green-500'
                  } text-blue-dark font-semibold rounded-lg  hover:text-white py-4 px-4`}
                >
                  +1 Min
                </button>
                <button
                  onClick={() => {
                    setValue((value) => value + 60);
                  }}
                  className={`bg-zinc-800 w-full ml-2 ${
                    isWorkTimer ? 'hover:bg-red-500' : 'hover:bg-green-500'
                  } text-blue-dark font-semibold rounded-lg  hover:text-white py-4 px-4`}
                >
                  -1 Min
                </button>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default CountDown;
