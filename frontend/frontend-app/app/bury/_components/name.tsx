import { useEffect } from "react";

interface NameFieldProps {
  data: string;
  setData: (data: string) => void;
  validateData: (validation: boolean) => void;
}

const NameField: React.FC<NameFieldProps> = ({
  data,
  setData,
  validateData,
}) => {
  useEffect(() => {
    validateData(data.length > 0);
  }, [data, validateData]);
  return (
    <div className="flex w-full flex-col gap-2">
      <input
        type="text"
        className="w-full rounded-lg border border-gray-500 px-2"
        placeholder="名前を入力"
        value={data}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
    </div>
  );
};

export default NameField;
