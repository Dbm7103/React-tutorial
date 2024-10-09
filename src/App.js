import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
    return (
        <button
            className={`square ${highlight ? 'highlight' : ''}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
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
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return { winner: null, line: null };
}

function Board({ xIsNext, squares, onPlay }) {
    const { winner, line } = calculateWinner(squares);
    let status;

    if (winner) {
        status = "Winner: " + winner;
    } else if (squares.every((square) => square !== null)) {
        status = "It's a draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function handleClick(i) {
        if (squares[i] || winner) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    return (
        <>
            <div className="status">{status}</div>
            {Array.from({ length: 3 }, (_, row) => (
                <div className="board-row" key={row}>
                    {Array.from({ length: 3 }, (_, col) => {
                        const index = row * 3 + col;
                        const isWinningSquare = line && line.includes(index);
                        return (
                            <Square
                                key={index}
                                value={squares[index]}
                                onSquareClick={() => handleClick(index)}
                                highlight={isWinningSquare}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
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

    function toggleSortOrder() {
        setIsAscending(prev => !prev);
    }

    function resetGame() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
        setIsAscending(true);
    }

    const moves = history.map((squares, move) => {
        let description;
        let col, row;

        if (move > 0) {
            const lastMoveIndex = squares.findIndex((square, index) => square !== history[move - 1][index]);
            col = (lastMoveIndex % 3) + 1; // Cột
            row = Math.floor(lastMoveIndex / 3) + 1; // Dòng
            description = `Go to move #${move} (row: ${row}, col: ${col})`;
        } else {
            description = 'Go to game start';
        }

        return (
            <li key={move}>
                {move === currentMove ? (
                    move > 0 ? (
                        <span>You are at move #{move} (row: {row}, col: {col})</span>
                    ) : (
                        <span>You are at game start</span>
                    )
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });

    const sortedMoves = isAscending ? moves : [...moves].reverse();

    return (
        <>
            <h1 className="title">Tic-Tac-Toe</h1>
            <button className="new-game-button" onClick={resetGame}>
                New Game
            </button>
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                </div>
                <div className="game-info">
                    <button className="sort-button" onClick={toggleSortOrder}>
                        Sort Moves {isAscending ? 'Descending' : 'Ascending'}
                    </button>
                    <ol>{sortedMoves}</ol>
                </div>
            </div>
        </>
    );
}
