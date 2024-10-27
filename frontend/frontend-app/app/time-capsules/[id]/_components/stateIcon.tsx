import { useState, useEffect } from "react";

interface StateIconProps {
  state: "waiting" | "digging" | "opened";
  setState: (state: "waiting" | "digging" | "opened") => void;
}

const StateIcon: React.FC<StateIconProps> = ({
  state,
  setState,
}: StateIconProps) => {
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === "digging") {
      timer = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setState("opened");
    }
    return () => clearInterval(timer);
  }, [state, timeLeft, setState]);

  const startDigging = () => {
    setState("digging");
    setTimeLeft(60);
  };

  return (
    <div className="flex w-full grow flex-col items-center justify-center text-center">
      <div className="flex h-10 w-full items-center justify-center rounded-lg border">
        {state === "waiting" && (
          <button className="p-2" onClick={startDigging}>
            掘る
          </button>
        )}
        {state === "digging" && <p className="p-2">{timeLeft}</p>}
        {state === "opened" && (
          <p className="p-2">タイムカプセルを開封しました！</p>
        )}
      </div>

      <div className="flex w-full grow items-center justify-center bg-red-500">
        画像
      </div>
    </div>
  );
};

export default StateIcon;
