const LAYERS: string[] = [
  'bg-main-gradient opacity-1',
  'bg-chart-gradient opacity-0',
  'bg-trends-gradient opacity-0',
  'bg-portfolio-gradient opacity-0',
  'bg-setting-gradient opacity-0',
];

function BackgroundLayers() {
  return (
    <>
      {LAYERS.map((layerClass, index) => (
        <div
          key={index}
          className={`bg-global fixed inset-0 z-0 pointer-events-none ${layerClass}`}
        />
      ))}
    </>
  );
}

export default BackgroundLayers;