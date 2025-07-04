import React from "react";
import {
  ActivitySquare,
  Repeat,
  Banknote,
  Scale,
  Users,
} from "lucide-react";

type Caution = {
  PRICE_FLUCTUATIONS: boolean;
  TRADING_VOLUME_SOARING: boolean;
  DEPOSIT_AMOUNT_SOARING: boolean;
  GLOBAL_PRICE_DIFFERENCES: boolean;
  CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
};

const CoinCautionBadge = ({ caution }: { caution?: Caution }) => {
  if (!caution) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 font-bold text-[10px] text-[#f08c6c]">
      {caution.PRICE_FLUCTUATIONS && (
        <span className="flex items-center gap-0.5">
          <ActivitySquare size={14} />
          가격 급등락
        </span>
      )}
      {caution.TRADING_VOLUME_SOARING && (
        <span className="flex items-center gap-0.5">
          <Repeat size={14} />
          거래량 급증
        </span>
      )}
      {caution.DEPOSIT_AMOUNT_SOARING && (
        <span className="flex items-center gap-0.5">
          <Banknote size={14} />
          입금 급증
        </span>
      )}
      {caution.GLOBAL_PRICE_DIFFERENCES && (
        <span className="flex items-center gap-0.5">
          <Scale size={14} />
          김프
        </span>
      )}
      {caution.CONCENTRATION_OF_SMALL_ACCOUNTS && (
        <span className="flex items-center gap-0.5">
          <Users size={14} />
          소액 계좌 집중
        </span>
      )}
    </div>
  );
};

export default CoinCautionBadge;