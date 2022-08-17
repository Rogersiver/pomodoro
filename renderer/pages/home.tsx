import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Title from '../components/Title';
import CountDown from '../components/CountDown';

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Pomodoro</title>
      </Head>
      <div
        style={{
          display: 'flex',
          overflowY: 'hidden',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Title />
        <CountDown />
      </div>
    </React.Fragment>
  );
}

export default Home;
