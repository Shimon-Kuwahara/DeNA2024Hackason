interface AutoPhotoFieldProps {
  data: string;
  setData: (data: string) => void;
  validateData: (validation: boolean) => void;
}

import { useEffect } from "react";
import Image from "next/image";

import React from "react";
import Webcam from "react-webcam";

const AutoPhotoField: React.FC<AutoPhotoFieldProps> = ({
  data,
  setData,
  validateData,
}) => {
  useEffect(() => {
    validateData(data !== "");
  });

  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();

    if (imageSrc) {
      console.log(imageSrc); // キャプチャした画像をログに表示
      setData(imageSrc);
    }
  }, [webcamRef, setData]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {/* プレビュー画面を表示 */}
      <div className="relative h-full w-full">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg"
          style={{ width: "100%", height: "auto", transform: "scaleX(-1)" }}
        />
      </div>
      {/* ボタンを配置 */}
      <div className="flex h-8 w-full items-center justify-center rounded-lg bg-blue-500 text-lg text-white shadow-lg">
        <button onClick={capture}>Capture Photo</button>
      </div>
      {data !== "" && (
        <div className="h-full w-full rounded-lg shadow-lg">
          <Image
            height={300}
            width={300}
            src={data}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default AutoPhotoField;
