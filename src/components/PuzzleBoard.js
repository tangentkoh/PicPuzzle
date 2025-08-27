import React, { useState, useEffect, useRef } from "react";
import "./PuzzleBoard.css";

const PuzzleBoard = ({ imageSrc, rows = 3, cols = 3 }) => {
  const [pieces, setPieces] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [draggingPieceId, setDraggingPieceId] = useState(null);
  const boardRef = useRef(null);

  // 画像をピースに分割する処理
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const fullWidth = img.width;
      const fullHeight = img.height;

      const pieceWidth = fullWidth / cols;
      const pieceHeight = fullHeight / rows;

      const generatedPieces = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pieceCanvas = document.createElement("canvas");
          const pieceCtx = pieceCanvas.getContext("2d");
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;

          pieceCtx.drawImage(
            img,
            c * pieceWidth,
            r * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          generatedPieces.push({
            id: r * cols + c,
            image: pieceCanvas.toDataURL(),
            correctPos: { r, c },
            width: pieceWidth,
            height: pieceHeight,
          });
        }
      }

      const shuffledPieces = shuffleArray([...generatedPieces]);
      setPieces(shuffledPieces);
      setIsSolved(false);
    };
  }, [imageSrc, rows, cols]);

  // 配列をシャッフルするヘルパー関数
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // ドラッグ＆ドロップイベントハンドラ
  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData("pieceId", pieceId.toString());
    setDraggingPieceId(pieceId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPieceId) => {
    e.preventDefault();
    const draggedPieceId = parseInt(e.dataTransfer.getData("pieceId"));

    if (draggedPieceId === targetPieceId) return;

    setPieces((prevPieces) => {
      const newPieces = [...prevPieces];
      const draggedIndex = newPieces.findIndex((p) => p.id === draggedPieceId);
      const targetIndex = newPieces.findIndex((p) => p.id === targetPieceId);

      [newPieces[draggedIndex], newPieces[targetIndex]] = [
        newPieces[targetIndex],
        newPieces[draggedIndex],
      ];

      return newPieces;
    });

    setDraggingPieceId(null);
  };

  // パズル完成判定
  useEffect(() => {
    if (pieces.length === 0) return;

    const isPuzzleSolved = pieces.every((piece, index) => piece.id === index);
    setIsSolved(isPuzzleSolved);
  }, [pieces]);

  return (
    <div className="puzzle-container">
      {isSolved && (
        <h2 className="puzzle-solved-message">パズル完成！おめでとう！🎉</h2>
      )}
      <div
        ref={boardRef}
        className="puzzle-board"
        style={{
          "--rows": rows,
          "--cols": cols,
          "--aspect-ratio":
            pieces.length > 0 ? pieces[0].width / pieces[0].height : 1,
        }}
      >
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={`puzzle-piece ${
              draggingPieceId === piece.id ? "dragging" : ""
            }`}
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: `
                ${(100 / (cols - 1)) * piece.correctPos.c || 0}%
                ${(100 / (rows - 1)) * piece.correctPos.r || 0}%
              `,
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
            }}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, piece.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, piece.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PuzzleBoard;
