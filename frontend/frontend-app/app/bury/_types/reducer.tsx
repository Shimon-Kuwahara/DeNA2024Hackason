export interface BuryState {
  name: string;
  members: string[];
  location: {
    lat: number;
    lng: number;
    note: string;
  };
  photo: File | null;
  auto_photo: string;
}

type BuryAction =
  | { field: "name"; payload: string }
  | { field: "members"; payload: string[] }
  | { field: "location"; payload: { lat: number; lng: number; note: string } }
  | { field: "photo"; payload: File | null }
  | { field: "auto_photo"; payload: string };

export const BuryReducer = (
  state: BuryState,
  action: BuryAction,
): BuryState => {
  switch (action.field) {
    case "name":
      return { ...state, name: action.payload };
    case "members":
      return { ...state, members: action.payload };
    case "location":
      return { ...state, location: action.payload };
    case "photo":
      return { ...state, photo: action.payload };
    case "auto_photo":
      console.log(action.payload);
      return { ...state, auto_photo: action.payload };
  }
};
