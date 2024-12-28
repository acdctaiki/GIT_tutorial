import React, { useState, useEffect } from "react";
import "./../styles.css";

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
  const [message, setMessage] = useState("");
  const [lastGame, setLastGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1],
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
    setMessage("");
    setGameStarted(true);
  };

  const isInBounds = (x, y) => x >= 0 && x < rows && y >= 0 && y < cols;

  const isValidMove = (row, col, board, player) => {
    if (board[row][col]) return false;
    const opponent = player === "black" ? "white" : "black";

    for (let [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let foundOpponent = false;

      while (isInBounds(x, y) && board[x][y] === opponent) {
        foundOpponent = true;
        x += dx;
        y += dy;
      }

      if (foundOpponent && isInBounds(x, y) && board[x][y] === player) {
        return true;
      }
    }

    return false;
  };

  const flipDiscs = (row, col, board, player) => {
    const newBoard = board.map((row) => [...row]);
    const opponent = player === "black" ? "white" : "black";

    newBoard[row][col] = player;

    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      const discsToFlip = [];

      while (isInBounds(x, y) && newBoard[x][y] === opponent) {
        discsToFlip.push([x, y]);
        x += dx;
        y += dy;
      }

      if (isInBounds(x, y) && newBoard[x][y] === player) {
        discsToFlip.forEach(([flipX, flipY]) => {
          newBoard[flipX][flipY] = player;
        });
      }
    });

    return newBoard;
  };

  const countDiscs = (board) => {
    return board.flat().reduce(
      (counts, cell) => {
        if (cell === "black") counts.black++;
        if (cell === "white") counts.white++;
        return counts;
      },
      { black: 0, white: 0 }
    );
  };

  const handleTurnChange = (currentBoard, currentTurn) => {
    const nextTurn = currentTurn === "black" ? "white" : "black";
    const hasValidMove = currentBoard.some((row, rowIndex) =>
      row.some((cell, colIndex) => isValidMove(rowIndex, colIndex, currentBoard, nextTurn))
    );

    if (hasValidMove) {
      setTurn(nextTurn);
      setMessage("");
    } else {
      setMessage(`${nextTurn === "black" ? "黒" : "白"}は動ける手がありません。`);
    }

    if (
      !hasValidMove &&
      !currentBoard.some((row, rowIndex) =>
        row.some((cell, colIndex) => isValidMove(rowIndex, colIndex, currentBoard, currentTurn))
      )
    ) {
      setGameOver(true);
      handleGameOver(currentBoard);
    }
  };

  const handleGameOver = (board) => {
    const { black, white } = countDiscs(board);
    setWinner(black > white ? "black" : "white");
    setLastGame({ black, white, winner: black > white ? "black" : "white" });
  };

  const handleCellClick = (row, col) => {
    if (gameOver || !isValidMove(row, col, board, turn)) {
      setMessage("無効な手です。");
      return;
    }

    const newBoard = flipDiscs(row, col, board, turn);
    setBoard(newBoard);
    handleTurnChange(newBoard, turn);
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
      const timer = setTimeout(handleAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  return (
    <div className="App">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>オセロゲーム</h1>
          {lastGame && (
            <div className="last-game">
              <h2>前回の記録</h2>
              <p>黒: {lastGame.black} 駒</p>
              <p>白: {lastGame.white} 駒</p>
              <p>勝者: {lastGame.winner === "black" ? "黒" : "白"}</p>
            </div>
          )}
          <button onClick={initializeBoard}>ゲームを開始</button>
        </div>
      ) : (
        <>
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
              <p>{message}</p>
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
        </>
      )}
    </div>
  );
};

export default App;
