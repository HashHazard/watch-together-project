import React from "react";

const ProgressBar = ({
  played,
  loaded,
  onSeekMouseDown,
  onSeekChange,
  onSeekMouseUp,
}) => {
  return (
    <div className="progress-bar">
      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={played}
        onMouseDown={onSeekMouseDown}
        onChange={onSeekChange}
        onMouseUp={onSeekMouseUp}
      />
      <progress max={1} value={loaded} />
    </div>
  );
};

export default ProgressBar;
