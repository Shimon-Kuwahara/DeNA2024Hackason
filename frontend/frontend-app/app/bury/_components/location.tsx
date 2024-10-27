import { useEffect } from "react";

interface LocationFieldProps {
  data: { lat: number; lng: number; note: string };
  setData: (data: { lat: number; lng: number; note: string }) => void;
  validateData: (validation: boolean) => void;
}

const LocationField: React.FC<LocationFieldProps> = ({
  data,
  setData,
  validateData,
}) => {
  useEffect(() => {
    validateData(data.lat !== 0 && data.lng !== 0);
  }, [data, validateData]);

  const GetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setData({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        note: data.note,
      });
    });
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <button
        className="w-full rounded-lg bg-blue-500 text-center text-white"
        onClick={GetLocation}
      >
        位置情報を取得
      </button>
      <div className="grid grid-cols-[1fr_3fr] gap-2">
        <p>緯度</p>
        <p className="rounded-lg border border-gray-500 bg-gray-300 px-2 text-right">
          {data.lat}
        </p>
        <p>経度</p>
        <p className="rounded-lg border border-gray-500 bg-gray-300 px-2 text-right">
          {data.lng}
        </p>
        <p>メモ</p>
        <input
          type="text"
          className="rounded-lg border border-gray-500 px-2"
          onChange={(e) => {
            setData({ lat: data.lat, lng: data.lng, note: e.target.value });
          }}
        ></input>
      </div>
    </div>
  );
};

export default LocationField;
