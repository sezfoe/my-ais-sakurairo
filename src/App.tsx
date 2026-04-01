/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { SCORE_DATA } from "./scoreData";

// Helper to convert characters using the notation map
const toFullWidth = (char: string) => {
  if (!char) return SCORE_DATA.notationMap["-"];
  
  // Process each character through the map, fallback to original if not found
  return char.split('').map(c => 
    (SCORE_DATA.notationMap as Record<string, string>)[c] || c
  ).join('');
};

// Parser for the new string-based measure format
const parseMeasure = (measureStr: string): string[][] => {
  const beats = measureStr.split(',');
  return beats.map(beatStr => {
    const notes: string[] = [];
    let i = 0;
    while (i < beatStr.length) {
      let char = beatStr[i];
      if (char === 'b' && i + 1 < beatStr.length) {
        notes.push('b' + beatStr[i + 1]);
        i += 2;
      } else {
        notes.push(char);
        i++;
      }
    }
    return notes;
  });
};

const Beat: React.FC<{ notes: string[] }> = ({ notes }) => {
  // If notes array has 2 elements, it's an 8th note group (needs underline)
  const isGrouped = notes.length >= 2;
  
  return (
    <div className="relative flex flex-col items-center justify-center px-0.5 min-w-[32px] md:min-w-[36px] h-10 text-black">
      <div className="flex items-center gap-0 text-base md:text-lg font-medium leading-none">
        {notes.map((note, i) => {
          const hasFlat = note.includes('b');
          const baseNote = note.replace('b', '');
          const displayBase = toFullWidth(baseNote);
          
          return (
            <span key={i} className="relative inline-flex items-center justify-center w-[1em]">
              {hasFlat && (
                <span className="absolute -top-7 left-0 right-0 text-center font-normal text-lg md:text-xl">
                  {SCORE_DATA.notationMap["b"]}
                </span>
              )}
              {displayBase}
            </span>
          );
        })}
      </div>
      {isGrouped && (
        <div className="absolute bottom-1.5 left-0.5 right-0.5 h-[2px] bg-black rounded-full" />
      )}
    </div>
  );
};

const Measure: React.FC<{ beats: string[][]; index: number }> = ({ beats }) => {
  // A measure is considered "short" if it doesn't have the standard 3 beats
  const isShortMeasure = beats.length < 3;
  
  return (
    <div className={`relative flex items-center border-r border-black py-2 px-2 ${isShortMeasure ? 'justify-start' : 'justify-center'} w-full h-full`}>
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
    <div className="min-h-screen bg-[#f5f5f0] text-black font-serif selection:bg-stone-200 selection:text-stone-800">
      {/* Header */}
      <header className="max-w-5xl mx-auto pt-8 pb-4 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-tighter">
            {SCORE_DATA.title}
          </h1>
        </motion.div>
      </header>

      {/* Score Area - All Sections in One Block */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden"
        >
          <div className="p-6 md:p-10">
            <div className="space-y-5">
              {sectionsToRender.map((sectionKey) => {
                const currentSection = SCORE_DATA.sections[sectionKey as keyof typeof SCORE_DATA.sections];
                
                // Group measures into rows based on "\n" marker or 8-measure limit
                const rows: { measures: string[] }[] = [];
                let currentMeasures: string[] = [];
                
                currentSection.forEach((item) => {
                  if (item === "\n") {
                    if (currentMeasures.length > 0) {
                      rows.push({ measures: [...currentMeasures] });
                      currentMeasures = [];
                    }
                  } else {
                    currentMeasures.push(item);
                    if (currentMeasures.length === 8) {
                      rows.push({ measures: [...currentMeasures] });
                      currentMeasures = [];
                    }
                  }
                });
                
                // Add any remaining measures
                if (currentMeasures.length > 0) {
                  rows.push({ measures: [...currentMeasures] });
                }

                return (
                  <div key={sectionKey} className="space-y-2">
                    {/* Section Header */}
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-black uppercase font-serif">
                        {getSectionLabel(sectionKey)}
                      </span>
                      <div className="h-[1px] flex-1 bg-stone-100" />
                    </div>

                    <div className="space-y-0 overflow-x-auto custom-scrollbar">
                      {rows.map((rowObj, rowIdx) => (
                        <div key={rowIdx} className="relative min-w-[800px] lg:min-w-full">
                          <div className="grid grid-cols-8 border-l border-black">
                            {rowObj.measures.map((measure, mIdx) => (
                              <Measure 
                                key={mIdx} 
                                beats={parseMeasure(measure)} 
                                index={rowIdx * 8 + mIdx} 
                              />
                            ))}
                            {/* Fill empty space in the row if less than 8 measures */}
                            {rowObj.measures.length < 8 && Array.from({ length: 8 - rowObj.measures.length }).map((_, i) => (
                              <div key={`empty-${i}`} className="border-r border-stone-200 w-full h-full" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend & Info */}
            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col gap-3 leading-tight">
              <div className="flex flex-wrap items-center gap-3 text-lg tracking-widest">
                <span className="text-sm uppercase tracking-[0.2em] text-black font-sans mr-2">演奏曲序:</span>
                {SCORE_DATA.sequence.map((s, i) => (
                  <React.Fragment key={i}>
                    <span className="text-black font-semibold uppercase">
                      {getSectionLabel(s)}
                    </span>
                    {i < SCORE_DATA.sequence.length - 1 && (
                      <span className="text-black/30 text-sm">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {SCORE_DATA.demoUrl && (
                <div className="text-lg text-black tracking-wider">
                  <span className="text-sm uppercase tracking-[0.2em] text-black font-sans mr-2">參考資料:</span>
                  <a href={SCORE_DATA.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 transition-colors break-all underline underline-offset-4 decoration-black/20">
                    {SCORE_DATA.demoUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 10mm;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .min-h-screen {
            background-color: white !important;
            min-height: auto !important;
          }
          header, main {
            max-width: 100% !important;
            padding-top: 0 !important;
            margin: 0 !important;
          }
          h1 {
            font-size: 28pt !important;
            margin-bottom: 1rem !important;
            color: black !important;
          }
          /* Force exactly 8 equal columns */
          .grid-cols-8 {
            display: grid !important;
            grid-template-columns: repeat(8, 12.5%) !important;
            width: 100% !important;
            min-width: 0 !important;
            border-bottom: 1px solid black !important;
          }
          /* Ensure measures don't grow based on content */
          .relative.flex.items-center.border-r.border-black {
            width: 100% !important;
            min-width: 0 !important;
            overflow: hidden !important;
            padding: 4px 2px !important;
          }
          /* Shrink notes to fit */
          .text-base, .md\:text-lg {
            font-size: 11pt !important;
            letter-spacing: -0.02em !important;
            white-space: nowrap !important;
          }
          /* Reduce gaps between beats */
          .flex.items-center.gap-0\.5 {
            gap: 1px !important;
          }
          /* Remove minimum width constraints for print */
          .min-w-\[32px\], .md\:min-w-\[36px\] {
            min-width: 0 !important;
          }
          /* Hide scrollbars */
          .custom-scrollbar, .overflow-x-auto {
            overflow: visible !important;
          }
          /* Adjust legend spacing */
          .mt-12 {
            margin-top: 1.5rem !important;
            padding-top: 1rem !important;
          }
          .text-lg {
            font-size: 12pt !important;
          }
        }

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
