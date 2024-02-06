import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square"
      onClick={onSquareClick}
    > 
      {value} 
    </button>
  );
}

function RestartButton({ onClearClick }) {
  return (
    <button
      className="clear"
      onClick={onClearClick}
    >
      Clear Board
    </button>
  )
}

export default function Board() {
  const [xNext, setXNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const winner = calculateWinner(squares, xNext)
  let status;
  if (winner) {
    status = "Winner is " + winner;
  } else {
    status = "Pick your next move";
  }
  
  function makeMove(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xNext ? "O" : "X";
      setSquares(nextSquares);
      setXNext(!xNext);
  }

  async function handleClick(i) {
    makeMove(i)

    // const squares = this.state.squares.slice()
    // console.log("handleClick")
    // console.log(squares)
    // const aiMove = findBestSquare(squares, this.state.xIsNext ? "X" : "O");
    // if (aiMove !== -1) {
    //   await makeMove(aiMove)
    // }
  }

  function handleClearClick() {
    const emptySquares = Array(9).fill(null);
    setSquares(emptySquares);
    setXNext("X")
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div><RestartButton onClearClick={() => handleClearClick()}/></div>
    </>
  );
}

function calculateWinner(squares, player) {
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFilled(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}

function findBestSquare(squares, player) {
  // 'player' is the maximizing player
  // 'opponent' is the minimizing player
  const opponent = player === 'X' ? 'O' : 'X';
  
  const minimax = (squares, isMax) => {
    const winner = calculateWinner(squares);
    
    // If player wins, score is +1
    if (winner === player) return { square: -1, score: 1 };
    
    // If opponent wins, score is -1
    if (winner === opponent) return { square: -1, score: -1 };
    
    // If Tie, score is 0
    if (isBoardFilled(squares)) return { square: -1, score: 0 };
    
    // Initialize 'best'. If isMax, we want to maximize score, and minimize otherwise.
    const best = { square: -1, score: isMax ? -1000 : 1000 };
    
    // Loop through every square on the board
    for (let i = 0; i < squares.length; i++) {
      // If square is already filled, it's not a valid move so skip it
      if (squares[i]) {
        continue;
      }
      
      // If square is unfilled, then it's a valid move. Play the square.
      squares[i] = isMax ? player : opponent;
      // Simulate the game until the end game and get the score,
      // by recursively calling minimax.
      const score = minimax(squares, !isMax).score;
      // Undo the move
      squares[i] = null;

      if (isMax) {
        // Maximizing player; track the largest score and move.
        if (score > best.score) {
          best.score = score;
          best.square = i;
        }
      } else {
        // Minimizing opponent; track the smallest score and move.
        if (score < best.score) {
          best.score = score;
          best.square = i;
        }
      }
    }
    
    // The move that leads to the best score at end game.
    return best;
  };
  
  // The best move for the 'player' given current board
  return minimax(squares, true).square;
}