const Legend = () => {
  return (
    <div className="flex items-center justify-center gap-5 text-[8px] lg:text-xs">
      <div className="flex items-center justify-center gap-2">
        <p>Best personal lap time</p>
        <div className="flex h-1 w-1 bg-green-400 lg:h-3 lg:w-3"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p>Best lap time / sector time</p>
        <div className="h-1 w-1 bg-red-400 lg:h-3 lg:w-3"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p>Bad lap (107% of average lap time)</p>
        <div className="h-1 w-1 bg-orange-300 lg:h-3 lg:w-3"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p>Invalid lap</p>
        <div className="h-1 w-1 bg-[rgba(255,253,184,0.4)] lg:h-3 lg:w-3"></div>
      </div>
    </div>
  );
};

export default Legend;
