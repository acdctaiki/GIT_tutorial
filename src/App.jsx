import React, { useState, useEffect } from "react";
import "./../styles.css"; // スタイルファイルを参照

const App = () => {
  const rows = 8;
  const cols = 8;

  const [board, setBoard] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null))
  );
  const [turn, setTurn] = useState("black");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  const initializeBoard = () => {
    const newBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));
    newBoard[3][3] = "white";
    newBoard[3][4] = "black";
    newBoard[4][3] = "black";
    newBoard[4][4] = "white";
    setBoard(newBoard);
    setTurn("black");
    setGameOver(false);
    setWinner(null);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const isValidMove = (row, col, board, player) => {
    if (board[row][col]) return false;

    const opponent = player === "black" ? "white" : "black";

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let foundOpponent = false;

      while (x >= 0 && x < rows && y >= 0 && y < cols && board[x][y] === opponent) {
        foundOpponent = true;
        x += dx;
        y += dy;
      }

      if (foundOpponent && x >= 0 && x < rows && y >= 0 && y < cols && board[x][y] === player) {
        return true;
      }
    }

    return false;
  };

  const flipDiscs = (row, col, board, player) => {
    const newBoard = board.map(row => [...row]);
    const opponent = player === "black" ? "white" : "black";

    newBoard[row][col] = player;

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const discsToFlip = [];

      while (x >= 0 && x < rows && y >= 0 && y < cols && newBoard[x][y] === opponent) {
        discsToFlip.push([x, y]);
        x += dx;
        y += dy;
      }

      if (x >= 0 && x < rows && y >= 0 && y < cols && newBoard[x][y] === player) {
        discsToFlip.forEach(([flipX, flipY]) => {
          newBoard[flipX][flipY] = player;
        });
      }
    }

    return newBoard;
  };

  const countDiscs = board => {
    let blackCount = 0;
    let whiteCount = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell === "black") blackCount++;
        if (cell === "white") whiteCount++;
      });
    });
    return { blackCount, whiteCount };
  };

  const checkGameOver = board => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (isValidMove(row, col, board, "black") || isValidMove(row, col, board, "white")) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (row, col) => {
    if (gameOver || !isValidMove(row, col, board, turn)) return;

    const newBoard = flipDiscs(row, col, board, turn);
    setBoard(newBoard);

    if (checkGameOver(newBoard)) {
      setGameOver(true);
      const { blackCount, whiteCount } = countDiscs(newBoard);
      setWinner(blackCount > whiteCount ? "black" : "white");
    } else {
      setTurn(turn === "black" ? "white" : "black");
    }
  };

  const handleAIMove = () => {
    const validMoves = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (isValidMove(row, col, board, turn)) {
          validMoves.push([row, col]);
        }
      }
    }
    if (validMoves.length > 0) {
      const [row, col] = validMoves[Math.floor(Math.random() * validMoves.length)];
      handleCellClick(row, col);
    }
  };

  useEffect(() => {
    if (!gameOver && turn === "white") {
      setTimeout(handleAIMove, 500);
    }
  }, [turn, board]);

  return (
    <div className="App">
      <h1>オセロゲーム</h1>
      {gameOver ? (
        <div>
          <h2>ゲーム終了</h2>
          <p>勝者: {winner === "black" ? "黒" : "白"}</p>
          <button onClick={initializeBoard}>もう一度プレイ</button>
        </div>
      ) : (
        <>
          <p>現在のターン: {turn === "black" ? "黒" : "白"}</p>
          <div className="board">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && <div className={`disc ${cell}`}></div>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
