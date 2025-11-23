const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen p-4 pt-16 w-full bg-chart-gradient text-neutral-100 overflow-hidden">
      {children}
    </div>
  );
};

export default ChartLayout;