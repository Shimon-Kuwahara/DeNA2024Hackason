import React from "react";

interface MoveStageProps {
  current_stage: number;
  validation_check: boolean;
  set_stage: (next_stage: number) => void;
}

const MoveStage: React.FC<MoveStageProps> = ({
  current_stage,
  validation_check,
  set_stage,
}) => {
  return (
    <div className="grid h-20 w-full grid-cols-2 gap-4">
      <button
        className="rounded-lg border text-center text-lg shadow-lg"
        onClick={
          current_stage === 0 ? () => {} : () => set_stage(current_stage - 1)
        }
      >
        {current_stage === 0 ? "キャンセル" : "戻る"}
      </button>
      <button
        className={[
          "rounded-lg border text-center text-lg shadow-lg",
          !validation_check ? "bg-gray-300" : "bg-blue-500 text-white",
        ].join(" ")}
        onClick={() => set_stage(current_stage + 1)}
        disabled={!validation_check}
      >
        次へ
      </button>
    </div>
  );
};

export default MoveStage;
