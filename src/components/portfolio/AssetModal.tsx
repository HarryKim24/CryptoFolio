'use client';

import { useEffect, useState, FormEvent } from 'react';
import type { Asset } from '../../types/assetTypes';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { AnimatePresence, motion } from 'framer-motion';
import { getChosung } from '@/utils/getChosung';

type Market = {
  market: string;
  korean_name: string;
  english_name: string;
};

type AssetModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'userId' | '_id'>) => void;
};

type AssetInput = {
  symbol?: string;
  name?: string;
  quantity?: number;
  averagePrice?: number;
  date?: string;
  type?: 'buy' | 'sell';
};

const tradeTypes: Array<'buy' | 'sell'> = ['buy', 'sell'];

const AssetModal = ({ show, onClose, onSave }: AssetModalProps) => {
  const [marketList, setMarketList] = useState<Market[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [input, setInput] = useState<AssetInput>({});

  useEffect(() => {
    if (show) {
      fetch('/api/proxy/market?isDetails=true')
        .then((res) => res.json())
        .then((data: Market[]) => {
          const krwMarkets = data.filter((item) =>
            item.market.startsWith('KRW-')
          );
          setMarketList(krwMarkets);
        });

      setInput({});
      setInputValue('');
      setFilteredMarkets([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [show]);

  const handleSelect = (market: Market) => {
    setInput((prev) => ({
      ...prev,
      symbol: market.market.replace('KRW-', ''),
      name: market.korean_name,
    }));
    setInputValue(`${market.korean_name} (${market.market.replace('KRW-', '')})`);
    setFilteredMarkets([]);
  };

  const handleQuantityChange = (value: string) => {
    const parsed = parseFloat(value);
    setInput((prev) => ({
      ...prev,
      quantity: Number.isNaN(parsed) || parsed < 0 ? undefined : parsed,
    }));
  };

  const handleAveragePriceChange = (value: string) => {
    const parsed = parseFloat(value);
    setInput((prev) => ({
      ...prev,
      averagePrice: Number.isNaN(parsed) || parsed < 0 ? undefined : parsed,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setInput((prev) => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
    }));
  };

  const totalPrice = (input.quantity ?? 0) * (input.averagePrice ?? 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { symbol, name, quantity, averagePrice, date, type } = input;

    if (!symbol || !name) {
      alert('코인을 검색하고 목록에서 선택해주세요.');
      return;
    }

    if (
      quantity === undefined ||
      averagePrice === undefined ||
      !date ||
      !type
    ) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    onSave({
      symbol,
      name,
      quantity,
      averagePrice,
      date,
      type,
    });
    onClose();
  };

  const isFormComplete = Boolean(
    input.symbol &&
      input.name &&
      input.quantity !== undefined &&
      input.averagePrice !== undefined &&
      input.date &&
      input.type
  );

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 text-neutral-100 backdrop-blur-3xl rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">거래 추가</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-100 hover:brightness-125 text-3xl p-2"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm font-medium">
              {tradeTypes.map((tradeType) => (
                <button
                  key={tradeType}
                  type="button"
                  className={`rounded-xl py-2 text-sm font-semibold transition focus:outline-none ${
                    input.type === tradeType
                      ? 'bg-portfolio hover:brightness-105 text-neutral-100'
                      : 'bg-white/10 hover:brightness-105 text-gray-300'
                  }`}
                  onClick={() =>
                    setInput((prev) => ({
                      ...prev,
                      type: tradeType,
                    }))
                  }
                >
                  {tradeType === 'buy' ? '구매' : '매도'}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="코인 검색"
                className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 placeholder-neutral-100 focus:outline-none"
                value={inputValue}
                onChange={(event) => {
                  const value = event.target.value;
                  setInputValue(value);
                  setInput((prev) => ({
                    ...prev,
                    symbol: undefined,
                    name: undefined,
                  }));

                  const lowerValue = value.toLowerCase();
                  const isChosungOnly = /^[ㄱ-ㅎ]+$/.test(value);
                  const choValue = isChosungOnly ? getChosung(value) : null;

                  const filtered = marketList.filter((item) => {
                    const symbol = item.market.replace('KRW-', '').toLowerCase();
                    const korean = item.korean_name;
                    const english = item.english_name.toLowerCase();
                    const lowerKorean = korean.toLowerCase();
                    const choKorean = getChosung(korean);

                    return (
                      lowerKorean.includes(lowerValue) ||
                      english.includes(lowerValue) ||
                      symbol.includes(lowerValue) ||
                      (isChosungOnly &&
                        choValue !== null &&
                        choKorean.includes(choValue))
                    );
                  });

                  setFilteredMarkets(filtered);

                  const matchedMarket = marketList.find(
                    (item) =>
                      value ===
                      `${item.korean_name} (${item.market.replace('KRW-', '')})`
                  );

                  if (matchedMarket) {
                    setInput((prev) => ({
                      ...prev,
                      symbol: matchedMarket.market.replace('KRW-', ''),
                      name: matchedMarket.korean_name,
                    }));
                    setFilteredMarkets([]);
                  }
                }}
              />
              {filteredMarkets.length > 0 && (
                <ul className="absolute z-50 w-full bg-portfolio mt-1 rounded-xl shadow max-h-48 overflow-y-auto">
                  {filteredMarkets.map((market) => (
                    <li
                      key={market.market}
                      className="px-4 py-2 hover:brightness-105 cursor-pointer"
                      onClick={() => handleSelect(market)}
                    >
                      {market.korean_name} ({market.market.replace('KRW-', '')})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="relative w-full">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="수량"
                  className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 pr-10 placeholder-neutral-100 focus:outline-none"
                  value={input.quantity ?? ''}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-neutral-100">
                  개
                </span>
              </div>
              <div className="relative w-full">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="코인당 가격"
                  className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 pr-10 placeholder-neutral-100 focus:outline-none"
                  value={input.averagePrice ?? ''}
                  onChange={(event) =>
                    handleAveragePriceChange(event.target.value)
                  }
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-neutral-100">
                  원
                </span>
              </div>
            </div>

            <div className="mb-4">
              <DatePicker
                selected={input.date ? new Date(input.date) : null}
                onChange={handleDateChange}
                dateFormat="yyyy년 MM월 dd일"
                placeholderText="날짜 선택"
                locale={ko}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none placeholder-neutral-100"
                wrapperClassName="w-full"
                calendarClassName="!bg-white !text-black rounded-lg shadow-xl"
              />
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-neutral-100">사용된 총액</p>
              <p className="text-xl font-semibold">
                {totalPrice.toLocaleString()} 원
              </p>
            </div>

            <button
              type="submit"
              disabled={!isFormComplete}
              className={`w-full py-3 font-semibold rounded-xl transition focus:outline-none ${
                isFormComplete
                  ? 'bg-portfolio hover:brightness-105 text-neutral-100'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              거래 추가
            </button>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssetModal;