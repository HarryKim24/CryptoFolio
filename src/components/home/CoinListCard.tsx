import Link from 'next/link';
import type { CoinChange } from '@/hooks/useTrendData';

type CoinListCardProps = {
  title: string;
  coins: CoinChange[];
  isRise: boolean;
};

const CoinListCard = ({ title, coins, isRise }: CoinListCardProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 shadow min-w-[320px] md:w-[380px] overflow-x-auto whitespace-nowrap">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ol className="space-y-0.5 text-sm text-left">
        {coins.map((coin, index) => (
          <li key={coin.market}>
            <Link
              href={`/chart/${coin.market}`}
              className="flex justify-between items-center p-1 -mx-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="truncate min-w-[160px] xs:min-w-[200px]">
                {index + 1}. {coin.korean_name} ({coin.market})
              </span>
              <span className="flex pl-1 gap-1">
                <span className="min-w-16 text-right">
                  {coin.trade_price.toLocaleString()} 원
                </span>
                <span
                  className={`w-16 pr-2 xs:pr-0 text-right ${
                    isRise ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  {isRise ? '+' : ''}
                  {(coin.signed_change_rate * 100).toFixed(1)}%
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CoinListCard;