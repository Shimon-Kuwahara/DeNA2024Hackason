import { useState, useEffect } from "react";

interface DiggingProps {
  isActive: boolean;
  onOpened: () => void;
  onFailed: () => void;
  lefttime: number;
  cup_id: string;
}

const limitTime: number = 10;

const Closing: React.FC<DiggingProps> = ({
  isActive,
  onOpened,
  onFailed,
  lefttime,
  cup_id,
}) => {
  const [timeLeft, setTimeLeft] = useState(limitTime);

  useEffect(() => {
    setTimeLeft(lefttime);
  }, [lefttime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      check_opened(cup_id).then((is_open) => {
        if (is_open) {
          onOpened();
        } else {
          onFailed();
        }
      });
    }

    return () => clearInterval(timer);
  });

  return (
    <p className="text-center text-5xl">
      カプセルが
      <br />
      埋まるまで
      <br />
      {timeLeft}秒！
    </p>
  );
};

async function check_opened(capsule_id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capsule/${capsule_id}/result/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },}
    );

    if (!response.ok) {
      throw new Error("capsule check failed");
    }

    const jsonData = await response.json();
    console.log(jsonData);

    return jsonData.is_open;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export default Closing;
