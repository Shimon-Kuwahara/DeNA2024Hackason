import React from "react";

interface ProgressBarProps {
  current_stage: number;
  total_stages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current_stage,
  total_stages,
}) => {
  const progressPercentage = (current_stage / total_stages) * 100;

  return (
    <div className="h-4 w-full overflow-hidden rounded-lg bg-gray-200">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
