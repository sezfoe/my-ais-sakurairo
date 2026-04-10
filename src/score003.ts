// Score data with strict 3-beat structure and notation rules
export const SCORE_DATA = {
  title: "4/4",
  beatsPerMeasure: 4,
  demoUrl: "",
  sequence: ["a"],
  sectionLabels: {
    outro: "尾"
  },
  notationMap: {
    "*": "。",
    "-": "，",
    "0": "０", "1": "１", "2": "２", "3": "３", "4": "４",
    "5": "５", "6": "６", "7": "７", "8": "８", "9": "９",
    "b": "♭"
  },
  sections: {
    a: [
      "\n",
      "b一.二,三四,五六,七八",
      "b1.2,34,56,78",
      "--,--,--,--",
      "*,*,*,*",
      "-二,-二,-二,-二",
      "二-,二-,二-,二-",
      "-7,-7,-7,-7",
      "1-,7-,7-,7-",
      "\n",
      "1-,7-,7-,7-"
    ],
  }
};
