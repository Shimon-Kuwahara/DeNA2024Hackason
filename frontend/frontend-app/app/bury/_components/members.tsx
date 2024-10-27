import { useEffect } from "react";

import { MdDelete } from "react-icons/md";

interface MembersFieldProps {
  data: string[];
  setData: (data: string[]) => void;
  validateData: (validation: boolean) => void;
}

const MembersField: React.FC<MembersFieldProps> = ({
  data,
  setData,
  validateData,
}) => {
  useEffect(() => {
    validateData(data.length > 0 && data.every((member) => member.length > 0));
  }, [data, validateData]);

  const handleSetMembers = (index: number, value: string) => {
    setData(data.map((member, i) => (i === index ? value : member)));
  };

  const handleDeleteMembers = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };
  const handleAddMembers = () => {
    const members = [...data, ""];
    setData(members);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {data.map((member, index) => (
        <div key={index} className="flex w-full gap-2">
          <input
            key={index}
            type="email"
            className="grow rounded-lg border border-gray-500 px-2"
            value={member}
            onChange={(e) => {
              handleSetMembers(index, e.target.value);
            }}
          />
          <button
            className="rounded-lg bg-red-500 px-2 text-white"
            onClick={() => handleDeleteMembers(index)}
          >
            <MdDelete />
          </button>
        </div>
      ))}
      <button
        className="w-full rounded-lg bg-blue-500 text-white"
        onClick={() => handleAddMembers()}
      >
        メンバーを追加
      </button>
    </div>
  );
};

export default MembersField;
