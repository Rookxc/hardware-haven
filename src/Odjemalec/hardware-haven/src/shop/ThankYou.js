import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

function ThankYou() {
  const [confettiVisible, setConfettiVisible] = useState(false);

  useEffect(() => {
    // Set confetti to be visible after a delay
    const timeout = setTimeout(() => {
      setConfettiVisible(true);
    }, 500);

    // Clean up timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Thank You!</h1>
        <p className="text-lg text-center">Your purchase was successful.</p>
        <p className="text-lg text-center">We appreciate your business.</p>
      </div>
      {confettiVisible && <Confetti />}
    </div>
  );
}

export default ThankYou;
