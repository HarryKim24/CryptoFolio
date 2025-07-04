'use client';

import dynamic from 'next/dynamic';

const CoinChart = dynamic(() => import('./CoinChart'), { ssr: false });

export default CoinChart;