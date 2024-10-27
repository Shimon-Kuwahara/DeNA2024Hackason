import { TimeCapsuleType } from "../types/time-cupsule";

export const fetchCapsule = async (url: string, debug?: boolean) => {
  if (debug) {
    return { data: CapsuleSample, error: null };
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const CapsuleSample: TimeCapsuleType = {
  name: "タイムカプセル",
  is_open: false,
  location: {
    lat: 35.681236,
    lng: 139.767125,
    note: "東京タワーの近く",
  },
};
