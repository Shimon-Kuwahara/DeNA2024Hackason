"use client";

import { useState, useReducer } from "react";
import {
  NameField,
  MembersField,
  LocationField,
  PhotoField,
  AutoPhotoField,
  MoveStage,
  ProgressBar,
  Dialog,
} from "./_components";
import { useRouter } from 'next/navigation';

import { BuryReducer, BuryState } from "./_types/reducer";

type StageType = {
  id: string;
  question: string;
  field: JSX.Element;
};

export default function Bury() {
  const [stage, setStage] = useState(0);
  const initialState: BuryState = {
    name: "",
    members: [],
    location: { lat: 0, lng: 0, note: "" },
    photo: null,
    auto_photo: "",
  };
  const [state, dispatch] = useReducer(BuryReducer, initialState);
  const [validationCheck, setValidationCheck] = useState(false);
  const router = useRouter();
  const stages: StageType[] = [
    {
      id: "name",
      question: "カプセルの名前は？",
      field: (
        <NameField
          data={state.name}
          setData={(data: string) => {
            dispatch({ field: "name", payload: data });
          }}
          validateData={(validation: boolean) => setValidationCheck(validation)}
        />
      ),
    },
    {
      id: "members",
      question: "メンバーのメールアドレスは？",
      field: (
        <MembersField
          data={state.members}
          setData={(data: string[]) => {
            dispatch({ field: "members", payload: data });
          }}
          validateData={(validation: boolean) => setValidationCheck(validation)}
        />
      ),
    },
    {
      id: "location",
      question: "場所は？",
      field: (
        <LocationField
          data={state.location}
          setData={(data: { lat: number; lng: number; note: string }) => {
            dispatch({ field: "location", payload: data });
          }}
          validateData={(validation: boolean) => setValidationCheck(validation)}
        />
      ),
    },
    {
      id: "photo",
      question: "画像(オプション)",
      field: (
        <PhotoField
          data={state.photo}
          setData={(data: File | null) => {
            dispatch({ field: "photo", payload: data });
          }}
          validateData={(validation: boolean) => setValidationCheck(validation)}
        />
      ),
    },
    {
      id: "auto-photo",
      question: "写真を撮影します",
      field: (
        <AutoPhotoField
        data= {state.auto_photo }
          setData={(data: string) => {
            dispatch({ field: "auto_photo", payload: data });
          }}
          validateData={(validation: boolean) => setValidationCheck(validation)}
        />
      ),
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="flex h-20 w-full items-center justify-center rounded-lg border text-lg shadow-lg">
        {stage < stages.length && stages[stage].question}
      </div>
      <div className="w-full grow rounded-lg border-2 border-gray-500 bg-gray-300 p-2 shadow-lg">
        {stage < stages.length ? stages[stage].field : null}
      </div>
      <MoveStage
        current_stage={stage}
        validation_check={validationCheck}
        set_stage={(next_stage) => {
          setStage(next_stage);
          setValidationCheck(false);
        }}
      />
      <ProgressBar current_stage={stage} total_stages={stages.length} />
      {stage === stages.length && (
        <Dialog
          onConfirm={() => {
            postCapsules(state, router);
          }}
          onCancel={() => {
            setStage(stages.length - 1);
          }}
        />
      )}
    </div>
  );
}


const transformState = (state: BuryState) => {
  return {
    name: state.name,
    is_open: false, // デフォルトで false
    members: state.members.join(","),
    location: `${state.location.lat},${state.location.lng}`,
    position_note: state.location.note,
    open_at: "2024-10-26 15:22:08.374986", // ハードコードされた日時
    aikotoba: "a", // ハードコードされたパスワード
    text: "a", // サンプルテキスト
    auto_photo: "http://example.com/movie.mp4",
    photo: "http://example.com/movie.mp4",
    movie: "http://example.com/movie.mp4", // サンプルURL
    opened_member: "a", // 空文字列
    open_requested_at: "2024-10-26 14:54:57.249745" // ハードコードされた日時
  };
};

async function postCapsules(data: BuryState, router: ReturnType<typeof useRouter>) {
  const json = transformState(data);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capsule/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (response.ok) {
      router.push('/');
    }
  } catch (error) {
    console.error('POST failed:', error);
  }
}
