const Legend = () => {
  return (
    <div className="flex items-center justify-center gap-5 text-xs">
      <div className="flex items-center justify-center gap-2">
        <p>Best personal lap time</p>
        <div className="flex h-3 w-3 bg-[rgba(210,255,196,1)]"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p>Best lap time / sector time</p>
        <div className="h-3 w-3 bg-[rgba(255,206,206,1)]"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p>Bad lap (107% of average lap time)</p>
        <div className="h-3 w-3 bg-[rgba(238,207,161,1)]"></div>
      </div>
    </div>
  );
};

export default Legend;
