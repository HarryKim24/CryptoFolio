import { getUpbitCandles } from '@/api/upbitCandle';
import {
  GetCandlesOptions,
  NormalizedCandle,
  upbitCandle,
} from '@/types/upbitTypes';

// [유지] 데이터 정규화 함수는 그대로 둡니다. (필수 로직)
const normalizeCandles = (candles: upbitCandle[]): NormalizedCandle[] => {
  return candles.map((candle) => {
    // KST 시간 문자열을 Date 객체로 변환
    const date = new Date(candle.candle_date_time_kst);
    
    return {
      date,
      open: candle.opening_price,
      high: candle.high_price,
      low: candle.low_price,
      close: candle.trade_price,
      volume: candle.candle_acc_trade_volume,
    };
  });
};

// [변경] 복잡한 while 루프와 setTimeout 제거
// 그냥 한 번 요청해서 받아온 만큼만 줍니다.
const fetchNormalizedCandles = async (
  options: GetCandlesOptions
  // signal 인자 제거 (AbortController 안 쓸 거니까)
): Promise<NormalizedCandle[]> => {
  // 기본값 설정
  const count = options.count ?? 200; // 업비트 최대가 200개라 보통 이걸로 설정

  // API 호출 (한 번만 함)
  const rawCandles = await getUpbitCandles({
    ...options,
    count, 
  });

  // 정규화 (변수명 매핑)
  const normalized = normalizeCandles(rawCandles);

  // 날짜 오름차순 정렬 (과거 -> 최신)
  // 차트 라이브러리가 보통 이걸 원함
  normalized.sort((a, b) => a.date.getTime() - b.date.getTime());

  // [변경] 중복 제거 로직(Set) 삭제
  // "API가 알아서 잘 주겠지"라고 믿는 게 주니어의 마음입니다.
  
  return normalized;
};

export { normalizeCandles, fetchNormalizedCandles };