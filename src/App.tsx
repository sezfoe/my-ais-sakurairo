/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Music } from "lucide-react";

// Score data with strict 3-beat structure and notation rules
const SCORE_DATA = {
  title: "桜色のワルツ",
  subtitle: "Sakura-iro no Waltz (Cherry Blossom Waltz)",
  demoUrl: "https://youtu.be/DT5Bmm4MsKo",
  sequence: ["a", "b", "c", "d", "e", "f", "a", "b", "c", "d", "e", "outro"],
  sectionLabels: {
    outro: "尾"
  },
  notationMap: {
    "-": "。",
    ",": "，",
    "0": "０", "1": "１", "2": "２", "3": "３", "4": "４",
    "5": "５", "6": "６", "7": "７", "8": "８", "9": "９",
    "b": "♭"
  },
  pickupSections: ["a", "outro"],
  sections: {
    a: [
      [["-"], ["-"], ["四", "五"]], // 起拍
      [["六"], [",", "五"], ["四", "六"]], 
      [["五"], ["1"], [",", "五"]], 
      [["四"], [",", "二"], ["三", "四"]], 
      [["三"], ["六"], [",", "三"]],
      [["二"], ["四"], ["2"]], 
      [["1"], ["六", "五"], ["四"]], 
      [["五"], ["五", "二"], ["二", "五"]], 
      [["三"], ["-"], ["四", "五"]]
    ],
    b: [
      [["六"], [",", "四"], ["五", "六"]], 
      [["五"], ["1"], [",", "五"]], 
      [["四"], [",", "二"], ["三", "四"]], 
      [["三"], ["六"], [",", "三"]],
      [["二"], ["四"], ["2"]], 
      [["1"], ["六", "五"], ["四"]], 
      [["五"], [",", "六"], ["五", "四"]], 
      [["四"], ["-"], ["2", "3"]]
    ],
    c: [
      [["4"], ["4", "3"], ["2", "1"]], 
      [["2", "3"], ["2", "1"], ["六"]], 
      [["五"], ["五", "二"], ["二", "五"]], 
      [["六"], ["-"], ["2", "3"]],
      [["4"], ["4", "3"], ["2", "1"]], 
      [["2", "3"], ["2", "1"], ["六"]], 
      [["五"], ["2"], ["4"]], 
      [["5"], ["-"], ["6", "5"]]
    ],
    d: [
      [["4"], [",", "4"], ["3", "2"]], 
      [["1"], ["-"], ["六", "1"]], 
      [["2"], ["1"], ["b七"]], 
      [["1"], ["-"], ["四", "五"]],
      [["六"], ["-"], ["五", "四"]], 
      [["五"], ["1"], ["3"]], 
      [["4"], ["4", "2"], ["2", "4"]], 
      [["5"], ["-"], ["6", "5"]]
    ],
    e: [
      [["4"], [",", "4"], ["3", "2"]], 
      [["1"], ["-"], ["六", "1"]], 
      [["2"], ["1"], ["b七"]], 
      [["1"], ["-"], ["四", "五"]],
      [["六"], ["-"], ["五", "四"]], 
      [["五"], ["1"], ["3"]], 
      [["4"], ["2"], ["b七"]], 
      [["六"], ["五"], ["四", "五"]]
    ],
    f: [
      [["六"], [",", "四"], ["五", "六"]], 
      [["五"], ["1"], [",", "五"]], 
      [["四"], [",", "二"], ["三", "四"]], 
      [["三"], ["六"], [",", "三"]],
      [["二"], ["四"], ["2"]], 
      [["1"], ["六", "五"], ["四"]], 
      [["五"], [",", "六"], ["五", "四"]], 
      [["四"], ["-"], ["-"]]
    ],
    outro: [
      [["-"], ["-"], ["四", "五"]], // 起拍
      [["六"], [",", "四"], ["五", "六"]], 
      [["五"], ["1"], [",", "五"]], 
      [["四"], [",", "二"], ["三", "四"]], 
      [["三"], ["六"], [",", "三"]],
      [["二"], ["四"], ["2"]], 
      [["1"], ["六", "五"], ["四"]], 
      [["五"], ["五", "二"], ["二", "五"]], 
      [["三"], ["-"], ["四", "五"]],
      [["六"], [",", "四"], ["五", "六"]], 
      [["五"], ["1"], ["3"]], 
      [["4"], [",", "2"], ["2", "4"]], 
      [["3"], ["2"], ["1"]],
      [["2"], ["-"], ["3", "4"]], 
      [["1"], ["六"], ["四", "b七"]], 
      [["六"], [",", "五"], ["四", "五"]], 
      [["四"], ["-"], ["-"]]
    ]
  }
};

// Helper to convert characters using the notation map
const toFullWidth = (char: string) => {
  if (!char) return SCORE_DATA.notationMap["-"];
  
  // Process each character through the map, fallback to original if not found
  return char.split('').map(c => 
    (SCORE_DATA.notationMap as Record<string, string>)[c] || c
  ).join('');
};

const Beat: React.FC<{ notes: string[] }> = ({ notes }) => {
  // If notes array has 2 elements, it's an 8th note group (needs underline)
  const isGrouped = notes.length >= 2;
  
  return (
    <div className="relative flex flex-col items-center justify-center px-0.5 min-w-[32px] md:min-w-[36px] h-10">
      <div className="flex items-center gap-0 text-base md:text-lg font-medium leading-none">
        {notes.map((note, i) => (
          <span key={i} className="inline-flex items-center justify-center w-[1em]">
            {toFullWidth(note)}
          </span>
        ))}
      </div>
      {isGrouped && (
        <div className="absolute bottom-1.5 left-0.5 right-0.5 h-[2px] bg-[#5A5A40] rounded-full" />
      )}
    </div>
  );
};

const Measure: React.FC<{ beats: string[][]; index: number }> = ({ beats }) => {
  return (
    <div className="relative flex items-center border-r border-stone-400 py-6 px-1 justify-center w-full h-full">
      <div className="flex items-center gap-0.5">
        {beats.map((beat, i) => (
          <Beat key={i} notes={beat} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const sectionsToRender = Object.keys(SCORE_DATA.sections);

  const getSectionLabel = (key: string) => {
    return SCORE_DATA.sectionLabels[key as keyof typeof SCORE_DATA.sectionLabels] || key;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#5A5A40] font-serif selection:bg-stone-200 selection:text-stone-800">
      {/* Header */}
      <header className="max-w-5xl mx-auto pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-2">
            {SCORE_DATA.title}
          </h1>
          <p className="text-stone-500 italic text-sm md:text-base tracking-widest uppercase">
            {SCORE_DATA.subtitle}
          </p>
        </motion.div>
      </header>

      {/* Score Area - All Sections in One Block */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[40px] shadow-sm border border-stone-200 overflow-hidden"
        >
          <div className="p-6 md:p-12">
            <div className="flex items-center gap-3 mb-10">
              <Music className="text-stone-300" size={24} />
              <h2 className="text-2xl italic uppercase tracking-[0.2em]">Complete Score</h2>
            </div>

            <div className="space-y-12">
              {sectionsToRender.map((sectionKey) => {
                const currentSection = SCORE_DATA.sections[sectionKey as keyof typeof SCORE_DATA.sections];
                
                // Group measures into rows
                const rows = [];
                const isPickupSection = SCORE_DATA.pickupSections.includes(sectionKey);
                
                if (isPickupSection) {
                  // First measure is pickup, put it in the first row
                  rows.push({ measures: currentSection.slice(0, 1), isPickup: true });
                  // Remaining measures in groups of 8
                  for (let i = 1; i < currentSection.length; i += 8) {
                    rows.push({ measures: currentSection.slice(i, i + 8), isPickup: false });
                  }
                } else {
                  // Standard grouping of 8 measures per row
                  for (let i = 0; i < currentSection.length; i += 8) {
                    rows.push({ measures: currentSection.slice(i, i + 8), isPickup: false });
                  }
                }

                return (
                  <div key={sectionKey} className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-stone-800 uppercase font-serif">
                        {getSectionLabel(sectionKey)}
                      </span>
                      <div className="h-[1px] flex-1 bg-stone-100" />
                    </div>

                    <div className="space-y-0 overflow-x-auto custom-scrollbar">
                      {rows.map((rowObj, rowIdx) => (
                        <div key={rowIdx} className="relative min-w-[800px] lg:min-w-full">
                          <div className="grid grid-cols-8 border-l border-stone-400">
                            {rowObj.isPickup ? (
                              <>
                                <Measure 
                                  beats={rowObj.measures[0]} 
                                  index={0} 
                                />
                                {Array.from({ length: 7 }).map((_, i) => (
                                  <div key={`empty-${i}`} className="border-r border-stone-200 w-full h-full" />
                                ))}
                              </>
                            ) : (
                              <>
                                {rowObj.measures.map((measure, mIdx) => (
                                  <Measure 
                                    key={mIdx} 
                                    beats={measure} 
                                    index={rowIdx * 8 + mIdx} 
                                  />
                                ))}
                                {/* Fill empty space in the row if less than 8 measures */}
                                {rowObj.measures.length < 8 && Array.from({ length: 8 - rowObj.measures.length }).map((_, i) => (
                                  <div key={`empty-${i}`} className="border-r border-stone-200 w-full h-full" />
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend & Info */}
            <div className="mt-20 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-sm text-stone-400 italic leading-relaxed">
                * 數字 (１-７) 代表高音 (甲音/大甲)，漢字 (四-七) 代表低音 (呂音/乾音)。
                <br />
                * 底線表示八分音符分組，逗號 (，) 代表半拍停頓，圓圈 (。) 代表一拍停頓。
              </div>
              <div className="text-xs font-sans tracking-[0.3em] text-stone-300 uppercase">
                Shinobue Notation • 3/4 Waltz
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Sequence Guide */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-6 bg-stone-100 rounded-3xl border border-stone-200 shadow-inner">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans block mb-3">Full Performance Order</span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-lg tracking-widest">
              {SCORE_DATA.sequence.map((s, i) => (
                <React.Fragment key={i}>
                  <span className="text-[#5A5A40] font-medium uppercase">
                    {getSectionLabel(s)}
                  </span>
                  {i < SCORE_DATA.sequence.length - 1 && (
                    <span className="text-stone-300 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto py-16 px-6 border-t border-stone-200 text-center">
        {SCORE_DATA.demoUrl && (
          <p className="text-stone-400 text-xs tracking-widest uppercase mb-4">
            參考資料: <a href={SCORE_DATA.demoUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600 transition-colors">YouTube 演奏參考</a>
          </p>
        )}
        <div className="flex justify-center gap-8">
          <div className="text-[10px] uppercase tracking-widest text-stone-300">
            Designed for Shinobue Players • Sakura-iro no Waltz
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d6cc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c2c2b8;
        }
      `}} />
    </div>
  );
}
