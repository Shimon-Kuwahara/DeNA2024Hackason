interface WaitingProps {
  onClick: () => void;
}

const Waiting: React.FC<WaitingProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="text-5xl">
      掘る！
    </button>
  );
};

export default Waiting;
