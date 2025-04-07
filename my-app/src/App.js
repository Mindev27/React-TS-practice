import {useState} from 'react'
import './styles.css'

function Square({value, onSquareClick, isWinning}) {
  // console.log('Render Square:', value, 'Clickable?', typeof onSquareClick === 'function')
  return (
    <button
      className={`square ${isWinning ? 'winner-square' : ''}`}
      onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay, N, M}) {
  function handleClick(idx) {
    if (squares[idx] || calculateWinner(squares).winner) {
      return
    }

    // console.log('Clicked', idx)

    const nextSquares = squares.slice()
    if (xIsNext === true) {
      nextSquares[idx] = 'X'
    } else {
      nextSquares[idx] = 'O'
    }
    onPlay(nextSquares)
  }

  const winnerInfo = calculateWinner(squares)
  const winner = winnerInfo?.winner
  const winningLine = winnerInfo?.lines ?? []

  let board = []
  for (let i = 0; i < N; i++) {
    let lines = []
    for (let j = 0; j < M; j++) {
      let currentIndex = i * M + j
      lines.push(
        <Square
          key={`${i}-${j}`}
          value={squares[currentIndex]}
          onSquareClick={() => handleClick(currentIndex)}
          isWinning={winningLine.includes(i * M + j)}
        />
      )
    }
    board.push(
      <div key={i} className="board-row">
        {lines}
      </div>
    )
  }

  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  )
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
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], lines: [a, b, c]}
    }
  }
  return {winner: null, lines: [null, null, null]}
}

export default function Game() {
  let N = 3
  let M = 3
  const [history, setHistory] = useState([Array(N * M).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove]
  const xIsNext = currentMove % 2 === 0

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    console.log('jump' + nextMove)
    // TODO
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to start'
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          N={N}
          M={M}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
