import React, { useEffect, useRef, useState } from "react";

interface SVGDisplayProps {
  filePaths: string[];
  defaultBpm: number; // デフォルトのBPM
}

const SVGDisplay: React.FC<SVGDisplayProps> = ({ filePaths, defaultBpm }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpm, setBpm] = useState(defaultBpm); // BPMの状態管理
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<number | null>(null); // setIntervalのIDを管理
  const minBpm = 40;
  const maxBpm = 320;


  const toggleScrolling = () => {
    if (isScrolling) {
      stopScrolling();
    } else {
      startScrolling();
    }
  };

  const startScrolling = () => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;

    // シンプルな計算でBPMを使用
    const scrollStep = bpm / 800; // BPMそのものをスクロール距離に利用
    const intervalDuration = 10; // スクロール間隔を一定に設定 (1ms)

    let accumulatedScroll = 0; // 累積スクロール距離

    setIsScrolling(true);

    const intervalId = window.setInterval(() => {
      const currentScroll = container.scrollTop;

      // 累積スクロールに`scrollStep`を足す
      accumulatedScroll += scrollStep;

      // 整数分だけスクロールする
      const integerScroll = Math.floor(accumulatedScroll);

      // 小数部分を次回に繰り越し
      accumulatedScroll -= integerScroll;

      // 実際にスクロールを進める
      container.scrollTo({
        top: currentScroll + integerScroll,
        behavior: "auto", // 即時更新
      });
    }, intervalDuration); // 間隔は固定

    setScrollInterval(intervalId);
  };

  const stopScrolling = () => {
    if (scrollInterval !== null) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
    setIsScrolling(false);
  };

  const resetScrolling = () => {
    // stopScrolling();
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(event.target.value, 10);
    if (!isNaN(newBpm)) {
      setBpm(newBpm);
    }
  };

  const handleBpmBlur = () => {
    // 入力が終了したタイミングで値を検証
    if (bpm < minBpm) {
      setBpm(minBpm); // 範囲外（小さい場合）は最小値に設定
    } else if (bpm > maxBpm) {
      setBpm(maxBpm); // 範囲外（大きい場合）は最大値に設定
    }
  };

  const handleBpmKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enterキーが押された場合に値を検証
    if (event.key === "Enter") {
      handleBpmBlur();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault(); // ページのスクロール防止
      toggleScrolling();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isScrolling]);


  return (
    <div className="flex justify-center items-start">
      {/* スクロール可能なコンテナ */}
      <div
        ref={containerRef}
        className="w-[900px] bg-base-100 shadow-md overflow-y-auto overflow-x-hidden"
        style={{
          height: "100vh", // 縦幅を画面の高さに拡張
          border: "1px solid #ddd",
        }}
      >
        {/* SVGを<img>タグでループして表示 */}
        {filePaths.map((path, index) => (
          <img key={index} src={path} alt={`Music sheet ${index + 1}`} className="w-full -mb-[65px]" />
        ))}
      </div>

      {/* コントロールパネル */}
      <div className="flex flex-col space-y-4 bg-white p-4">
        {/* BPM入力フォーム */}
        <div className="flex flex-col items-center">
          <label htmlFor="bpm-input" className="text-sm font-medium text-gray-700">
            BPM
          </label>
          <input
            id="bpm-input"
            type="number"
            min={minBpm}
            max={maxBpm}
            value={bpm}
            onChange={handleBpmChange}
            onBlur={handleBpmBlur}
            onKeyDown={handleBpmKeyDown}
            className="p-1 border border-gray-300 rounded-md w-16 text-center"
          />
        </div>
        <button
          onClick={toggleScrolling}
          className={`px-4 py-2 rounded-md text-white btn btn-primary`}
        >
          {isScrolling ? "Stop" : "Start"}
        </button>
        <button
          onClick={resetScrolling}
          className={`px-4 py-2 rounded-md text-white btn btn-secondary`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SVGDisplay;