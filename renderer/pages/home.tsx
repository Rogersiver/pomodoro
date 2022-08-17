import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Title from '../components/Title';
import AnimatedCricle from '../components/AnimatedCricle';

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Pomodoro</title>
      </Head>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Title />
        <AnimatedCricle />
      </div>
    </React.Fragment>
  );
}

export default Home;
