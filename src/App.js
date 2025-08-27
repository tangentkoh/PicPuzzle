import React, { useState } from "react";
import PuzzleBoard from "./components/PuzzleBoard";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  // ピース数を管理する新しいステート
  const [puzzleSize, setPuzzleSize] = useState({ rows: 3, cols: 3 });
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPuzzleKey((prevKey) => prevKey + 1); // 新しい画像でパズルをリセット
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePuzzleSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setPuzzleSize({ rows: size, cols: size });
  };

  return (
    <div className="App">
      <h1>ピクパズル</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && (
        <>
          <div className="settings-container">
            <label htmlFor="puzzle-size">ピース数を選択:</label>
            <select
              id="puzzle-size"
              onChange={handlePuzzleSizeChange}
              value={puzzleSize.rows}
            >
              <option value="3">9ピース (3x3)</option>
              <option value="4">16ピース (4x4)</option>
              <option value="5">25ピース (5x5)</option>
            </select>
          </div>
          <PuzzleBoard
            key={puzzleKey}
            imageSrc={image}
            rows={puzzleSize.rows}
            cols={puzzleSize.cols}
          />
        </>
      )}
    </div>
  );
}

export default App;
