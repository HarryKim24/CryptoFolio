import { ActivitySquare, Repeat, Banknote, Scale, Users } from "lucide-react";

type Caution = {
  PRICE_FLUCTUATIONS: boolean;
  TRADING_VOLUME_SOARING: boolean;
  DEPOSIT_AMOUNT_SOARING: boolean;
  GLOBAL_PRICE_DIFFERENCES: boolean;
  CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
};

type Props = {
  caution?: Caution;
  compact?: boolean;
};

const CoinCautionBadge = ({ caution, compact = false }: Props) => {
  if (!caution) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1 text-[#f08c6c]"
      title={compact ? "주의: 이상 징후 발생" : ""}
    >
      {caution.PRICE_FLUCTUATIONS && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold" title="가격 급등락">
          <ActivitySquare size={14} />
          {!compact && "가격 급등락"}
        </span>
      )}

      {caution.TRADING_VOLUME_SOARING && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold" title="거래량 급증">
          <Repeat size={14} />
          {!compact && "거래량 급증"}
        </span>
      )}

      {caution.DEPOSIT_AMOUNT_SOARING && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold" title="입금 급증">
          <Banknote size={14} />
          {!compact && "입금 급증"}
        </span>
      )}

      {caution.GLOBAL_PRICE_DIFFERENCES && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold" title="김프">
          <Scale size={14} />
          {!compact && "김프"}
        </span>
      )}

      {caution.CONCENTRATION_OF_SMALL_ACCOUNTS && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold" title="소액 계좌 집중">
          <Users size={14} />
          {!compact && "소액 계좌 집중"}
        </span>
      )}
    </div>
  );
};

export default CoinCautionBadge;