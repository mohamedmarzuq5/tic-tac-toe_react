import React, { useState/*Component*/ } from 'react';

function Square({ value, onSquareClick, glow }) {
  if (!glow) {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  } else {
    return (
      <button className="square glow" onClick={onSquareClick}>
        {value}
      </button>
    )

  }
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)/* *winner* maathram poore? as that variable works before this? */) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winnerAndSquares = calculateWinner(squares);
  const [winner, winnerSquares] = !(winnerAndSquares)?[null, null]:winnerAndSquares
  const draw = squares.includes(null);
  console.log(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (draw) {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  } else {
    status = "It's a draw";
  }

  const boardArr = [];
  for (let i = 0; i < 3; i++) {
    const squareArr = [];
    for (let j = 0 + 3 * i; j < 3 + 3 * i; j++) {
      if (winner) {
        if (j === winnerSquares[0] || j === winnerSquares[1] || j === winnerSquares[2]) {
          squareArr.push(<Square glow={1} key={j} value={squares[j]} onSquareClick={() => handleClick(j)} />);
        } else {
          squareArr.push(<Square glow={null} key={j} value={squares[j]} onSquareClick={() => handleClick(j)} />);
        }
      } else {
        squareArr.push(<Square glow={null} key={j} value={squares[j]} onSquareClick={() => handleClick(j)} />);
      }
    }

    boardArr.push(<div key={i} className='board-row'>{squareArr}</div>)
  }
  return (
    <div>
      <div className="status">{status}</div>
      {boardArr}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [currentIndex, setCurrentIndex] = useState([])

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // if(history.length > nextHistory.length) 
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setCurrentIndex([...currentIndex, index])
  }

  function jumpTo(nextMove) {
    if (nextMove >= history.length || nextMove < 0) {
      return null;
    } else {
      setCurrentMove(nextMove);
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #  ${move} [${findPosition(currentIndex[move - 1])}]`;
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <p>You are at move #{currentMove}</p>
        <ol>{moves}</ol>
        <div className='toggleBtn'>
          <button className='descending' onClick={() => jumpTo(currentMove - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <button className='ascending' onClick={() => jumpTo(currentMove + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function findPosition(i) {
  // console.log(currSquares);
  if (i < 3) {
    return [1, i + 1];
  } else if (i < 6) {
    return [2, i - 2];
  } else {
    return [3, i - 5];
  }
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
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
