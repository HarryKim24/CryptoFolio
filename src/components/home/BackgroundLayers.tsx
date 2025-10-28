const BackgroundLayers = () => {
  return (
    <>
      <div className="bg-global bg-main-gradient fixed inset-0 z-0 opacity-1 pointer-events-none" />
      <div className="bg-global bg-chart-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global bg-trends-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global bg-portfolio-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global fixed inset-0 z-0 opacity-0 pointer-events-none" />
    </>
  );
};

export default BackgroundLayers;
