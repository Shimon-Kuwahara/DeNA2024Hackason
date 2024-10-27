"use client";

import { TimeCapsuleType } from "@/app/types/time-cupsule";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Waiting, Digging, Opened } from "./_components";
import IconWindow from "./_components/iconwindows";

type TimeCapsuleState = "waiting" | "digging" | "opened";

export default function TimeCapsules() {
  const [state, setState] = useState<TimeCapsuleState>("waiting");
  const [timer, setTimer] = useState(60);

  const handleSetTimer = (time: Date) => {
    const limittime = 60;
    const diffMilliSecond = new Date().getTime() - time.getTime();
    const lefttime = limittime - diffMilliSecond / 1000;
    setTimer(lefttime);
    console.log(lefttime);
  };

  const data: TimeCapsuleType = {
    name: "タイムカプセル",
    is_open: false,
    location: {
      lat: 35.681236,
      lng: 139.767125,
      note: "東京タワーの近く",
    },
  };

  const params = useParams();
  const Id = params.id;
  fetchAndDisplayCapsules(Id as string);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <p className="flex h-20 w-full items-center justify-center rounded-lg border text-lg shadow-lg">
        {data.name}
      </p>
      <div
        className={[
          "flex h-64 w-full items-center justify-center rounded-lg border border-gray-500 p-2 shadow-lg",
          state === "waiting" ? "bg-yellow-900" : "",
          state === "digging" ? "bg-yellow-700" : "",
          state === "opened" ? "bg-yellow-500" : "",
        ].join(" ")}
      >
        <IconWindow state={state} />
      </div>
      <div className="flex w-full grow items-center justify-center rounded-lg border border-gray-500 bg-gray-300 p-2 shadow-lg">
        {state === "waiting" ? (
          <Waiting
            onClick={async () => {
              const response = await start_digging(Id as string);
              if (response !== null) {
                console.log("response", response);
                setState("digging");
                handleSetTimer(new Date(response));
              }
            }}
          />
        ) : state === "digging" ? (
          <Digging
            isActive={state === "digging"}
            onOpened={() => setState("opened")}
            onFailed={() => setState("waiting")}
            lefttime={timer}
            cup_id="6"
          />
        ) : (
          <Opened />
        )}
      </div>
    </div>
  );
}

async function start_digging(capsule_id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/capsule/${capsule_id}/open`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // user_id: nookies.get(null).user_id,
          user_id: "6",
          location: "35.686150373116,139.75316069643426",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("capsule digging failed");
    }

    const jsonData = await response.json();
    console.log(jsonData);

    return jsonData.start_time;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

{
  /*
function getLocation() {
  return new Promise<string>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve(`${latitude},${longitude}` as string);
      },
      (error) => reject(error),
    );
  });
}
 */
}

async function fetchAndDisplayCapsules(Id: string) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/capsule/${Id}/detail`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Capsule failed");
    }

    const jsonData = await response.json();
    console.log(jsonData);
  } catch (error) {
    console.error("Error:", error);
  }
}
