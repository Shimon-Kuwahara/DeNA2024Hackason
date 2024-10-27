import TreasureChestOpenAnimation from "@/public/animation/OpenChestAnimation";

interface IconWindowProps {
  state: "waiting" | "digging" | "opened";
}

const IconWindow: React.FC<IconWindowProps> = ({ state }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <TreasureChestOpenAnimation state={state} />
    </div>
  );
};

export default IconWindow;
