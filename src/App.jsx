import React from "react";
import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning-square" : "square"}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const gameBoard = 3;

  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const { winner, winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Game is a draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const boardRows = [];
  for (let row = 0; row < gameBoard; row++) {
    const squaresInRow = [];
    for (let col = 0; col < gameBoard; col++) {
      const index = row * gameBoard + col;
      const isWinningSquare = winningLine && winningLine.includes(index);
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function getMoveDescription(move, currentMove, history, winner, isDraw) {
    if (move === 0) {
      if (history.length === 1) {
        return "Waiting for next move...";
      }
      if (move === currentMove) {
        return "Viewing start";
      }
      return "Go to start";
    }
    if (winner) {
      return `Game Over! Winner: ${winner}`;
    }
    if (isDraw) {
      return "Game Over! It's a draw!";
    }
    if (move === currentMove) {
      if (move === history.length - 1) {
        return "Waiting for next move...";
      }
      return `Viewing move #${move}`;
    }
    return `Go to move #${move}`;
  }

  const moves = history.map((squares, move) => {
    const { winner } = calculateWinner(squares);
    const isDraw = !winner && squares.every((square) => square !== null);

    const description = getMoveDescription(
      move,
      currentMove,
      history,
      winner,
      isDraw
    );

    if (move === currentMove || winner || isDraw) {
      return (
        <li key={move}>
          <span>{description}</span>
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return { winner: null, winningLine: null };
}
