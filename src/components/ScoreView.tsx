import React from "react";
import { motion } from "motion/react";

// Helper to convert characters using the notation map
const toFullWidth = (char: string, notationMap: Record<string, string>) => {
  if (!char) return notationMap["-"] || "。";
  return char.split('').map(c => notationMap[c] || c).join('');
};

// Parser for the new string-based measure format
const parseMeasure = (measureStr: string): string[][] => {
  const beats = measureStr.split(',');
  return beats.map(beatStr => {
    const notes: string[] = [];
    let i = 0;
    while (i < beatStr.length) {
      let currentNote = "";
      // Collect all prefixes (b for flat, . for dot above)
      while (i < beatStr.length && (beatStr[i] === 'b' || beatStr[i] === '.')) {
        currentNote += beatStr[i];
        i++;
      }
      // Add the base note character
      if (i < beatStr.length) {
        currentNote += beatStr[i];
        i++;
      }
      if (currentNote) {
        notes.push(currentNote);
      }
    }
    return notes;
  });
};

const Beat: React.FC<{ notes: string[]; notationMap: Record<string, string>; beatsCount: number }> = ({ notes, notationMap, beatsCount }) => {
  const isEighthNote = notes.length >= 2 && notes.length < 4;
  const isSixteenthNote = notes.length >= 4;
  
  // Constant font size for 4/4, dynamic for others
  const getFontSizeClass = () => {
    if (beatsCount === 4) return "text-base md:text-lg"; 
    if (notes.length >= 4) return "text-[11px] md:text-[13px]";
    if (notes.length >= 3) return "text-[13px] md:text-[15px]";
    return "text-base md:text-lg";
  };

  // Alignment logic based on symbol count for 4/4
  const getAlignmentClass = () => {
    if (beatsCount !== 4) return "flex items-center gap-0";
    if (notes.length >= 4) return "grid grid-cols-4 w-full justify-items-center";
    if (notes.length >= 2) return "grid grid-cols-2 w-full justify-items-center";
    return "flex justify-center w-full";
  };

  return (
    <div className={`relative flex flex-col items-center justify-center px-0 ${beatsCount === 4 ? 'w-full' : 'min-w-[32px] md:min-w-[36px]'} h-12 text-black`}>
      <div className={`${getAlignmentClass()} ${getFontSizeClass()} font-medium leading-none`}>
        {notes.map((note, i) => {
          const hasFlat = note.includes('b');
          const hasDotAbove = note.includes('.');
          const baseNote = note.replace(/[b.]/g, '');
          const displayBase = toFullWidth(baseNote, notationMap);
          
          return (
            <span key={i} className="relative inline-flex items-center justify-center w-[1.2em]">
              {hasFlat && (
                <span className="absolute -top-7 left-0 right-0 text-center font-normal text-lg md:text-xl">
                  {notationMap["b"] || "♭"}
                </span>
              )}
              {hasDotAbove && (
                <span className="absolute -top-4 left-0 right-0 text-center font-bold text-sm md:text-base leading-none">
                  ．
                </span>
              )}
              {displayBase}
            </span>
          );
        })}
      </div>
      {isEighthNote && (
        <div className={`absolute bottom-2 ${beatsCount === 4 ? 'left-1 right-1' : 'left-0.5 right-0.5'} h-[1.5px] bg-black rounded-full`} />
      )}
      {isSixteenthNote && (
        <>
          <div className={`absolute bottom-2 ${beatsCount === 4 ? 'left-1 right-1' : 'left-0.5 right-0.5'} h-[1.5px] bg-black rounded-full`} />
          <div className={`absolute bottom-1 ${beatsCount === 4 ? 'left-1 right-1' : 'left-0.5 right-0.5'} h-[1.5px] bg-black rounded-full`} />
        </>
      )}
    </div>
  );
};

const Measure: React.FC<{ beats: string[][]; index: number; notationMap: Record<string, string>; beatsCount: number }> = ({ beats, notationMap, beatsCount }) => {
  const isShortMeasure = beats.length < beatsCount;
  
  return (
    <div className={`relative flex items-center border-r border-black py-2 px-0 ${isShortMeasure ? 'justify-start' : 'justify-center'} w-full h-full`}>
      <div className={`flex items-center gap-0 ${beatsCount === 4 ? 'w-full grid grid-cols-4' : 'gap-0.5'}`}>
        {beats.map((beat, i) => (
          <Beat key={i} notes={beat} notationMap={notationMap} beatsCount={beatsCount} />
        ))}
      </div>
    </div>
  );
};

interface ScoreViewProps {
  scoreData: any;
  onBack: () => void;
}

const ScoreView: React.FC<ScoreViewProps> = ({ scoreData, onBack }) => {
  const sectionsToRender = Object.keys(scoreData.sections);

  const getSectionLabel = (key: string) => {
    return scoreData.sectionLabels[key as keyof typeof scoreData.sectionLabels] || key;
  };

  const beatsCount = scoreData.beats || 3;
  const measuresPerRow = beatsCount === 4 ? 4 : 8; // 4拍子每行4小節，3拍子每行8小節
  const gridClass = beatsCount === 4 ? "grid-cols-4" : "grid-cols-8";
  const printGridClass = beatsCount === 4 ? "grid-cols-4" : "grid-cols-8";

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-serif selection:bg-stone-200 selection:text-stone-800">
      {/* Header */}
      <header className="max-w-5xl mx-auto pt-10 pb-6 px-6">
        <div className="relative flex items-center justify-center">
          <button 
            onClick={onBack}
            className="absolute left-0 p-3 hover:bg-stone-200 rounded-full transition-colors print:hidden"
            title="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-light tracking-tighter">
              {scoreData.title}
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Score Area - All Sections in One Block */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden"
        >
          <div className="p-2 md:p-4">
            <div className="space-y-1">
              {sectionsToRender.map((sectionKey) => {
                const currentSection = scoreData.sections[sectionKey as keyof typeof scoreData.sections];
                
                // Group measures into rows based on "\n" marker or 8-measure limit
                const rows: { measures: string[] }[] = [];
                let currentMeasures: string[] = [];
                
                currentSection.forEach((item: string) => {
                  if (item === "\n") {
                    if (currentMeasures.length > 0) {
                      rows.push({ measures: [...currentMeasures] });
                      currentMeasures = [];
                    }
                  } else {
                    currentMeasures.push(item);
                    if (currentMeasures.length === measuresPerRow) {
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
                  <div key={sectionKey} className="space-y-1">
                    {/* Section Header */}
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-black uppercase font-serif">
                        {getSectionLabel(sectionKey)}
                      </span>
                      <div className="h-[1px] flex-1 bg-stone-100" />
                    </div>

                    <div className="space-y-0 overflow-x-auto custom-scrollbar">
                      {rows.map((rowObj, rowIdx) => (
                        <div key={rowIdx} className="relative min-w-[1000px] lg:min-w-full">
                          <div className={`grid ${gridClass} border-l border-black`}>
                            {rowObj.measures.map((measure, mIdx) => (
                              <Measure 
                                key={mIdx} 
                                beats={parseMeasure(measure)} 
                                index={rowIdx * measuresPerRow + mIdx} 
                                notationMap={scoreData.notationMap}
                                beatsCount={beatsCount}
                              />
                            ))}
                            {/* Fill empty space in the row if less than measuresPerRow */}
                            {rowObj.measures.length < measuresPerRow && Array.from({ length: measuresPerRow - rowObj.measures.length }).map((_, i) => (
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
                <span className="text-sm uppercase tracking-[0.2em] text-black font-sans mr-2">演奏順序:</span>
                {scoreData.sequence.map((s: string, i: number) => (
                  <React.Fragment key={i}>
                    <span className="text-black font-semibold uppercase">
                      {getSectionLabel(s)}
                    </span>
                    {i < scoreData.sequence.length - 1 && (
                      <span className="text-black/30 text-sm">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {scoreData.demoUrl && (
                <div className="text-lg text-black tracking-wider">
                  <span className="text-sm uppercase tracking-[0.2em] text-black font-sans mr-2">參考資料:</span>
                  <a href={scoreData.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 transition-colors break-all underline underline-offset-4 decoration-black/20">
                    {scoreData.demoUrl}
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
            margin: 10mm 10mm;
          }
          * {
            box-sizing: border-box !important;
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
            font-size: 22pt !important;
            margin-bottom: 0.5rem !important;
            color: black !important;
          }
          .grid-cols-8 {
            display: grid !important;
            grid-template-columns: repeat(8, 12.5%) !important;
            width: 100% !important;
            min-width: 0 !important;
            border-bottom: none !important;
            border-top: none !important;
          }
          .grid-cols-4 {
            display: grid !important;
            grid-template-columns: repeat(4, 25%) !important;
            width: 100% !important;
            min-width: 0 !important;
            border-bottom: none !important;
            border-top: none !important;
          }
          .w-full.grid.grid-cols-4 {
            display: grid !important;
            grid-template-columns: repeat(4, 25%) !important;
            width: 100% !important;
          }
          .grid.grid-cols-2.w-full.justify-items-center {
            display: grid !important;
            grid-template-columns: repeat(2, 50%) !important;
            width: 100% !important;
          }
          .relative.flex.flex-col.items-center.justify-center.px-0.w-full {
            width: 100% !important;
            padding: 0 !important;
            height: 36px !important;
          }
          .flex.items-center.w-full.justify-around {
            display: flex !important;
            justify-content: space-around !important;
            width: 100% !important;
            font-size: 10pt !important;
          }
          .relative.flex.items-center.border-r.border-black {
            width: 100% !important;
            min-width: 0 !important;
            overflow: hidden !important;
            padding: 2px 1px !important;
            height: 32px !important;
          }
          /* Fix for notation overflow */
          .text-base, .md\:text-lg {
            font-size: 9pt !important;
            letter-spacing: -0.05em !important;
            white-space: nowrap !important;
            display: inline-flex !important;
          }
          .relative.inline-flex.items-center.justify-center.w-\[1em\] {
            width: 0.85em !important;
          }
          .flex.items-center.gap-0\.5 {
            gap: 0px !important;
          }
          .min-w-\[32px\], .md\:min-w-\[36px\], .min-w-\[800px\] {
            min-width: 0 !important;
          }
          .h-10 {
            height: 28px !important;
          }
          /* Adjust flat symbol position */
          .absolute.-top-7 {
            top: -1.2em !important;
            font-size: 10pt !important;
          }
          /* Adjust dot above position */
          .absolute.-top-4 {
            top: -0.7em !important;
            font-size: 9pt !important;
          }
          /* Double underline for 1/16 notes in print */
          .absolute.bottom-1.left-0\\.5.right-0\\.5.flex.flex-col {
            bottom: 2px !important;
            gap: 1px !important;
          }
          .absolute.bottom-1.left-0\\.5.right-0\\.5.flex.flex-col div {
            height: 1px !important;
          }
          .custom-scrollbar, .overflow-x-auto {
            overflow: visible !important;
          }
          .mt-12 {
            margin-top: 1rem !important;
            padding-top: 0.5rem !important;
          }
          .text-lg {
            font-size: 10pt !important;
          }
          .p-6, .md\:p-10 {
            padding: 0 !important;
          }
          .bg-white.rounded-2xl {
            border: none !important;
            box-shadow: none !important;
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
};

export default ScoreView;
