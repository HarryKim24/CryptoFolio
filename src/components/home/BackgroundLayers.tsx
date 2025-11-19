import React from 'react';

const LAYERS = [
  'bg-main-gradient opacity-1',
  'bg-chart-gradient opacity-0',
  'bg-trends-gradient opacity-0',
  'bg-portfolio-gradient opacity-0',
  'bg-setting-gradient opacity-0',
];

const BackgroundLayers = () => {
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
};

export default React.memo(BackgroundLayers);