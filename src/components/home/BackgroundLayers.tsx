const LAYERS = [
  "bg-main-gradient",
  "bg-chart-gradient",
  "bg-trends-gradient",
  "bg-portfolio-gradient",
  "bg-setting-gradient",
];

function BackgroundLayers() {
  return (
    <>
      {LAYERS.map((cls, index) => (
        <div
          key={index}
          className={`bg-global fixed inset-0 pointer-events-none ${cls}`}
          style={{
            zIndex: index,
            opacity: index === 0 ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}

export default BackgroundLayers;