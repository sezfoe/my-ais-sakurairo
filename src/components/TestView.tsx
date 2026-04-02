import React from "react";

interface TestViewProps {
  onBack: () => void;
}

const TestView: React.FC<TestViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* 這裡目前是空白的，您可以開始練習加入 UI 元件 */}
      <button 
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-stone-200 rounded hover:bg-stone-300 transition-colors"
      >
        返回
      </button>
    </div>
  );
};

export default TestView;
