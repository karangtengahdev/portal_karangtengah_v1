const getBatteryTone = (value: number) => {
  if (value < 30) {
    return 'bg-[#EF4141]';
  }

  if (value < 55) {
    return 'bg-[#F4B526]';
  }

  return 'bg-[#1DBE75]';
};

export const BatteryIndicator = ({ value }: { value: number }) => {
  const activeSegments = Math.max(1, Math.ceil((value / 100) * 6));
  const toneClassName = getBatteryTone(value);

  return (
    <div className="flex min-w-[126px] items-center gap-2">
      <span className="w-8 text-right text-xs font-medium text-[#4f5b52]">
        {value}%
      </span>
      <span className="flex flex-1 gap-1" aria-label={`Baterai ${value}%`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            className={[
              'h-1.5 flex-1 rounded-full',
              index < activeSegments ? toneClassName : 'bg-[#DDE3DA]',
            ].join(' ')}
            key={index}
          />
        ))}
      </span>
    </div>
  );
};
