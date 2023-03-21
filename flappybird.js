import React, { useState, useEffect, useRef } from 'react';

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(200);
  const [gravity, setGravity] = useState(2);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pipes, setPipes] = useState([{ x: 400, y: 0 }, { x: 600, y: 300 }]);
  const canvasRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.keyCode === 32) {
      setGravity(-10);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawBird = () => {
      ctx.beginPath();
      ctx.arc(100, birdY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    };

    const drawPipes = () => {
      pipes.forEach((pipe) => {
        ctx.beginPath();
        ctx.rect(pipe.x, pipe.y, 50, 200);
        ctx.fillStyle = 'green';
        ctx.fill();
      });
    };

    const checkCollision = () => {
      if (birdY <= 0 || birdY >= 400) {
        setGameOver(true);
      }
      pipes.forEach((pipe) => {
        if (
          (birdY <= pipe.y + 200 && birdY >= pipe.y && 100 >= pipe.x && 100 <= pipe.x + 50)
          || birdY === 0 || birdY === 400
        ) {
          setGameOver(true);
        }
      });
    };

    const update = () => {
      if (gameOver) return;
      setBirdY((prevY) => prevY + gravity);
      setPipes((prevPipes) => {
        const newPipes = prevPipes.map((pipe) => ({ ...pipe, x: pipe.x - 5 }));
        if (newPipes[0].x < -50) {
          newPipes.shift();
          newPipes.push({ x: 400, y: Math.floor(Math.random() * (200 - 0 + 1) + 0) });
          setScore((prevScore) => prevScore + 1);
        }
        return newPipes;
      });
      checkCollision();
      requestAnimationFrame(update);
    };

    update();
    return () => {
      cancelAnimationFrame(update);
    };
  }, [birdY, gameOver, gravity, pipes]);

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={400} />
      <div>Score: {score}</div>
      {gameOver && <div>Game Over!</div>}
    </div>
  );
};

export default FlappyBird;
