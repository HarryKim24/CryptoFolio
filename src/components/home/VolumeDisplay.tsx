type VolumeDisplayProps = {
  label: string;
  value: number;
};

const VolumeDisplay = ({ label, value }: VolumeDisplayProps) => {
  return (
    <div>
      <p className="text-neutral-400 text-lg pb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-100">
        {(value / 1e8).toFixed(0)}억 원
      </p>
    </div>
  );
};

export default VolumeDisplay;