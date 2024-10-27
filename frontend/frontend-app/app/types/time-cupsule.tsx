export type TimeCapsuleType = {
  name: string;
  is_open: boolean;
  location: {
    lat: number;
    lng: number;
    note: string;
  };
};
