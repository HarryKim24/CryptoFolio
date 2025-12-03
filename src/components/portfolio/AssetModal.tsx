'use client';

import { useEffect, useState, FormEvent } from 'react';
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

type AssetInputData = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  date: string;
  type: 'buy' | 'sell';
};

type AssetModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (asset: AssetInputData) => void;
};

type InputState = {
  symbol?: string;
  name?: string;
  quantity?: number;
  averagePrice?: number;
  date?: string;
  type?: 'buy' | 'sell';
};

const tradeTypes = ['buy', 'sell'] as const;

const AssetModal = ({ show, onClose, onSave }: AssetModalProps) => {
  const [marketList, setMarketList] = useState<Market[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  
  const [input, setInput] = useState<InputState>({ type: 'buy' });

  useEffect(() => {
    if (show) {
      const fetchMarkets = async () => {
        try {
          const res = await fetch('/api/proxy/market?isDetails=true');
          const data: Market[] = await res.json();
          
          const krwMarkets = data.filter((item) => item.market.startsWith('KRW-'));
          setMarketList(krwMarkets);
        } catch (error) {
          console.error("마켓 정보 로딩 실패", error);
        }
      };

      fetchMarkets();

      setInput({ type: 'buy' });
      setInputValue('');
      setFilteredMarkets([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [show]);

  const handleSelect = (market: Market) => {
    const symbol = market.market.replace('KRW-', '');
    setInput((prev) => ({
      ...prev,
      symbol,
      name: market.korean_name,
    }));
    setInputValue(`${market.korean_name} (${symbol})`);
    setFilteredMarkets([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    setInput((prev) => ({ ...prev, symbol: undefined, name: undefined }));

    if (!value) {
      setFilteredMarkets([]);
      return;
    }

    const lowerValue = value.toLowerCase();
    const isChosung = /^[ㄱ-ㅎ]+$/.test(value);
    const chosungValue = isChosung ? getChosung(value) : '';

    const filtered = marketList.filter((item) => {
      const symbol = item.market.replace('KRW-', '').toLowerCase();
      const name = item.korean_name;
      const engName = item.english_name.toLowerCase();
      const choName = getChosung(name);

      return (
        name.includes(value) ||
        engName.includes(lowerValue) ||
        symbol.includes(lowerValue) ||
        (isChosung && choName.includes(chosungValue))
      );
    });

    setFilteredMarkets(filtered);
  };

  const handleNumberChange = (field: 'quantity' | 'averagePrice', value: string) => {
    const parsed = parseFloat(value);
    setInput((prev) => ({
      ...prev,
      [field]: Number.isNaN(parsed) || parsed < 0 ? undefined : parsed,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setInput((prev) => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { symbol, name, quantity, averagePrice, date, type } = input;

    if (!symbol || !name) {
      alert('코인을 검색하고 목록에서 선택해주세요.');
      return;
    }

    if (!quantity || !averagePrice || !date || !type) {
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

  const totalPrice = (input.quantity ?? 0) * (input.averagePrice ?? 0);
  
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
                  onClick={() => setInput((prev) => ({ ...prev, type: tradeType }))}
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
                onChange={handleSearchChange}
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
                  onChange={(e) => handleNumberChange('quantity', e.target.value)}
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
                  onChange={(e) => handleNumberChange('averagePrice', e.target.value)}
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