/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SCORE_DATA as score001 } from "./score001";
import { SCORE_DATA as score002 } from "./score002";
import TestView from "./components/TestView";
import HomeView from "./components/HomeView";
import ScoreView from "./components/ScoreView";

// List of available scores (Button labels)
const SCORE_LIST = [
  "浜辺の歌",
  "桜色のワルツ"
];

// Map the display names to their respective data objects
const SCORE_DATA: Record<string, any> = {
  "浜辺の歌": score001,
  "桜色のワルツ": score002
};

export default function App() {
  const [view, setView] = useState<"home" | "score" | "blank">("home");
  const [selectedScore, setSelectedScore] = useState<string | null>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if "t" or "T" is pressed
      if (event.key.toLowerCase() === "t") {
        handleGoToBlank();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (scoreKey: string) => {
    setSelectedScore(scoreKey);
    setView("score");
  };

  const handleBack = () => {
    setSelectedScore(null);
    setView("home");
  };

  const handleGoToBlank = () => {
    setView("blank");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <HomeView 
            scoreList={SCORE_LIST} 
            onSelect={handleSelect} 
            onGoToBlank={handleGoToBlank} 
          />
        </motion.div>
      )}

      {view === "score" && selectedScore && (
        <motion.div
          key="score"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScoreView 
            scoreData={SCORE_DATA[selectedScore]} 
            onBack={handleBack} 
          />
        </motion.div>
      )}

      {view === "blank" && (
        <motion.div
          key="test"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <TestView onBack={handleBack} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
