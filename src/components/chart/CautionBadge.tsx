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

interface CoinCautionBadgeProps {
  caution?: Caution;
  compact?: boolean;
}

const CoinCautionBadge = ({ caution, compact = false }: CoinCautionBadgeProps) => {
  if (!caution) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1 text-[#f08c6c]"
      title={compact ? "주의: 여러 이상 징후 발생" : ""}
    >
      {caution.PRICE_FLUCTUATIONS && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold">
          <ActivitySquare size={14} />
          {!compact && "가격 급등락"}
        </span>
      )}
      {caution.TRADING_VOLUME_SOARING && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold">
          <Repeat size={14} />
          {!compact && "거래량 급증"}
        </span>
      )}
      {caution.DEPOSIT_AMOUNT_SOARING && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold">
          <Banknote size={14} />
          {!compact && "입금 급증"}
        </span>
      )}
      {caution.GLOBAL_PRICE_DIFFERENCES && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold">
          <Scale size={14} />
          {!compact && "김프"}
        </span>
      )}
      {caution.CONCENTRATION_OF_SMALL_ACCOUNTS && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold">
          <Users size={14} />
          {!compact && "소액 계좌 집중"}
        </span>
      )}
    </div>
  );
};

export default CoinCautionBadge;