import React, { useState } from "react";
import "./App.css";

type CellProps = {
  value: number;
  onClick: () => void;
};

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  const label = value === 16 ? "" : value.toString();
  return (
    <div className="cell" onClick={onClick}>
      {label}
    </div>
  );
};

const getNewCells = (): number[] => {
  let cells: number[] = Array.from({ length: 16 }, (_, i) => i + 1);
  cells.sort(() => Math.random() - 0.5);
  cells.push(16);
  return cells;
};

const isSolved = (cells: number[]): boolean => {
  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i] !== i + 1) {
      return false;
    }
  }
  return true;
};

const MindPuzzler: React.FC = () => {
  const [cells, setCells] = useState(getNewCells());

  const handleMove = (index: number) => {
    const emptyIndex = cells.indexOf(16);
    const neighborIndices = [emptyIndex - 4, emptyIndex + 4];
    if (emptyIndex % 4 !== 0) {
      neighborIndices.push(emptyIndex - 1);
    }
    if ((emptyIndex + 1) % 4 !== 0) {
      neighborIndices.push(emptyIndex + 1);
    }
    if (neighborIndices.includes(index)) {
      const newCells = [...cells];
      newCells[emptyIndex] = cells[index];
      newCells[index] = 16;
      setCells(newCells);
      if (isSolved(newCells)) {
        alert("Congratulations, you solved the puzzle!");
      }
    }
  };

  return (
    <div className="board">
      {cells.map((value, index) => (
        <Cell key={index} value={value} onClick={() => handleMove(index)} />
      ))}
    </div>
  );
};

export default MindPuzzler;
