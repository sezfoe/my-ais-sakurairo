import React from "react";
import { motion } from "motion/react";

interface HomeViewProps {
  scoreList: string[];
  onSelect: (scoreKey: string) => void;
  onGoToBlank: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ scoreList, onSelect, onGoToBlank }) => {
  return (
    <div className="min-h-screen bg-[#f5f5f0] p-8 flex flex-col gap-6 items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {scoreList.map((scoreName) => (
          <motion.button
            key={scoreName}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(scoreName)}
            className="px-6 py-4 bg-white text-black border border-stone-300 rounded-xl shadow-sm hover:bg-stone-50 transition-all text-base font-medium tracking-widest uppercase text-center"
          >
            {scoreName}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
