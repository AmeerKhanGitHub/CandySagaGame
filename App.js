import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import GameBoard from './src/components/GameBoard';
import {
  generateBoard,
  swapCandies,
  detectMatches,
  removeAndCollapse,
} from './src/logic/gameUtils';

const BOARD_SIZE = 8;
const LEVELS = 10;
const POINTS_PER_MATCH = 100;

const App = () => {
  const [board, setBoard] = useState(generateBoard(BOARD_SIZE));
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let matches = detectMatches(board, BOARD_SIZE);
    if (matches.length) {
      setTimeout(() => {
        setScore(s => s + matches.length * POINTS_PER_MATCH);
        setBoard(b => removeAndCollapse(b, matches, BOARD_SIZE));
      }, 300);
    }
  }, [board]);

  useEffect(() => {
    if (score >= level * 1000 && level < LEVELS) {
      setLevel(level + 1);
    }
  }, [score]);

  const handleSwap = (idx1, idx2) => {
    // Only allow adjacent swaps
    const isAdjacent =
      (Math.abs(idx1 - idx2) === 1 && Math.floor(idx1 / BOARD_SIZE) === Math.floor(idx2 / BOARD_SIZE)) ||
      Math.abs(idx1 - idx2) === BOARD_SIZE;
    if (!isAdjacent) return;

    const newBoard = swapCandies(board, idx1, idx2);
    if (detectMatches(newBoard, BOARD_SIZE).length) {
      setBoard(newBoard);
    }
  };

  const handleReset = () => {
    setBoard(generateBoard(BOARD_SIZE));
    setScore(0);
    setLevel(1);
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Candy Saga</Text>
      <Text style={styles.info}>Level: {level} / {LEVELS}</Text>
      <Text style={styles.info}>Score: {score}</Text>
      <GameBoard
        board={board}
        onSwap={handleSwap}
        selected={selected}
        setSelected={setSelected}
      />
      <Button title="Reset Game" onPress={handleReset} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginTop: 16 },
  info: { fontSize: 18, color: '#fff', marginVertical: 4 },
});

export default App;
